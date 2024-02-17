<?php
require 'vendor/autoload.php'; // Atur path ke file autoload.php

use ExpressPHP\Middleware\Cors;
use ExpressPHP\Middleware\HistoryApiFallback;
use ExpressPHP\Request;
use ExpressPHP\Response;
use ExpressPHP\Session\Session;


// Setup aplikasi ExpressPHP
$app = new ExpressPHP\App();
$app->use(new ExpressPHP\Middleware\BodyParser\Json());
$app->use(new ExpressPHP\Middleware\BodyParser\UrlEncoded());

// Set up MySQL connection
$db_host = getenv("DB_HOST");
$db_user = getenv("DB_USER");
$db_pass = getenv("DB_PASS");
$db_name = getenv("API_KEY");

$db = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Inisialisasi session
$session = new Session([
    'secret' => 'rahasia',
    'resave' => false,
    'saveUninitialized' => false
]);
$app->use($session);

// Middleware CORS
$app->use(new Cors());

// Middleware untuk mengatasi routing SPA (Single Page Application)
$app->use(new HistoryApiFallback());

// Pengaturan upload file dengan Multer
$storage = new \Upload\Storage\FileSystem('./file/');
$file = new \Upload\File('file', $storage);
$upload = new \Upload\Validation\Mimetype([
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
]);
$file->addValidations([$upload]);

// admin login
$app->post("/admin/login", function (Request $req, Response $res) use ($db) {
    $data = $req->getBody();
    $userName = $data['userName'];
    $passWord = $data['passWord'];

    $sql = "SELECT * FROM useradmin WHERE userName = ? AND passWord = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('ss', $userName, $passWord);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Autentikasi berhasil
        $session->set('authenticated', true);
        $res->json(['success' => true]);
    } else {
        // Autentikasi gagal
        $res->json(['success' => false, 'error' => 'Username atau password salah']);
    }
});

// beranda
$app->get("/", function (Request $req, Response $res) use ($db) {
    $sql = "SELECT * FROM home";
    $result = $db->query($sql);

    if (!$result) {
        $res->status(500)->send("Internal Server Error");
        return;
    }

    $data = $result->fetch_all(MYSQLI_ASSOC);
    $res->json($data);
});

// Pengaturan file upload dengan Multer
$storage = new \Upload\Storage\FileSystem('./file/');
$file = new \Upload\File('file', $storage);
$upload = new \Upload\Validation\Mimetype([
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
]);
$file->addValidations([$upload]);

// Middleware untuk mengatasi routing SPA (Single Page Application)
$app->use(new HistoryApiFallback());

// Profil
$app->get("/profil", function (Request $req, Response $res) use ($db) {
    $sql = "SELECT ID, kataPen, visimisi, struktur FROM profile";
    $result = $db->query($sql);

    if (!$result) {
        $res->status(500)->send("Internal Server Error");
        return;
    }

    $data = $result->fetch_all(MYSQLI_ASSOC);
    $res->json($data);
});

$app->post("/admin/profil", function (Request $req, Response $res) use ($db) {
    // Handle upload file
    $file->upload();

    $data = $req->getBody();
    $struktur = $file->getNameWithExtension();
    $kataPen = $data['kataPen'];
    $visimisi = $data['visimisi'];

    $sql = "INSERT INTO profile (kataPen, visimisi, struktur) VALUES (?, ?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('sss', $kataPen, $visimisi, $struktur);
    $stmt->execute();

    if (!$stmt) {
        $res->status(500)->json(['error' => 'Internal Server Error']);
        return;
    }

    $res->json(['success' => true]);
});

// pengumuman
$app->get("/pengumuman/:id", function ($req, $res) {
    $sql = "SELECT id, descNotice, document, judul, date FROM notice";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->get("/pengumuman/download/:filename", function ($req, $res) {
    $fileName = $req->getAttribute('filename');
    $filePath = __DIR__ . "/file/" . $fileName;
    $res->sendFile($filePath, function ($err) use ($res, $fileName) {
        if ($err) {
            console . error("Error sending file:", $err);
            $res->status($err->status)->end();
        } else {
            echo "File sent successfully: " . $fileName;
        }
    });
});

$app->post("/admin/pengumuman", function ($req, $res) {
    $sql = "INSERT INTO notice (descNotice, document, judul, date) VALUES (?)";
    $document = $_FILES["document"]["name"];
    $descNotice = $_POST["descNotice"];
    $judul = $_POST["judul"];
    $date = $_POST["date"];
    $values = [$descNotice, $document, $judul, $date];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/pengumuman/:id", function ($req, $res) {
    $noticeId = $req->getAttribute('id');
    $sql = "UPDATE notice SET descNotice=?, document=?, judul=?, date=? WHERE ID=?";

    $document = $_FILES["document"]["name"] ?? null;
    $judul = $_POST["judul"];
    $date = $_POST["date"];
    $values = [$document, $judul, $date, $noticeId];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res, $noticeId) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }

            if ($data->affectedRows === 0) {
                return $res->status(404)->json(["error" => "News not found"]);
            }

            return $res->json([
                "Status" => "Success",
                "message" => "News updated successfully",
            ]);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->delete("/admin/berita/:id", function ($req, $res) {
    $sql = "delete from news where id = ?";
    $id = $req->getAttribute('id');
    $db->query($sql, [$id], function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

// ekstrakurikuler
$app->get("/ekstrakurikuler/favorite", function ($req, $res) {
    $sql = "SELECT * FROM ekskulfav";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->get("/ekstrakurikuler/pilihan", function ($req, $res) {
    $sql = "SELECT * FROM ekskulpil";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/ekstrakurikuler/favorite", function ($req, $res) {
    $sql = "INSERT INTO ekskulfav (tittle, schedule, location, description, picture, picture2, picture3) VALUES (?)";
    $picture = $_FILES["picture"]["name"];
    $picture2 = $_FILES["picture2"]["name"];
    $picture3 = $_FILES["picture3"]["name"];
    $tittle = $_POST["tittle"];
    $schedule = $_POST["schedule"];
    $location = $_POST["location"];
    $description = $_POST["description"];
    $values = [$tittle, $schedule, $location, $description, $picture, $picture2, $picture3];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->post("/admin/ekstrakurikuler/pilihan", function ($req, $res) {
    $sql = "INSERT INTO ekskulpil (tittle, schedule, location, description, picture, picture2, picture3) VALUES (?)";
    $picture = $_FILES["picture"]["name"];
    $picture2 = $_FILES["picture2"]["name"];
    $picture3 = $_FILES["picture3"]["name"];
    $tittle = $_POST["tittle"];
    $schedule = $_POST["schedule"];
    $location = $_POST["location"];
    $description = $_POST["description"];
    $values = [$tittle, $schedule, $location, $description, $picture, $picture2, $picture3];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/ekstrakurikuler/favorite/:id", function ($req, $res) {
    $ekskulIdId = $req->getAttribute('id');
    $picture = $_FILES["picture"]["name"] ?? null;
    $picture2 = $_FILES["picture2"]["name"] ?? null;
    $picture3 = $_FILES["picture3"]["name"] ?? null;
    $tittle = $_POST["tittle"];
    $schedule = $_POST["schedule"];
    $location = $_POST["location"];
    $description = $_POST["description"];

    $updateValues = [
        "tittle" => $tittle,
        "schedule" => $schedule,
        "location" => $location,
        "description" => $description,
        "picture" => $picture,
        "picture2" => $picture2,
        "picture3" => $picture3
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE ekskulfav SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $ekskulIdId], function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/ekstrakurikuler/pilihan/:id", function ($req, $res) {
    $ekskulIdId = $req->getAttribute('id');
    $picture = $_FILES["picture"]["name"] ?? null;
    $picture2 = $_FILES["picture2"]["name"] ?? null;
    $picture3 = $_FILES["picture3"]["name"] ?? null;
    $tittle = $_POST["tittle"];
    $schedule = $_POST["schedule"];
    $location = $_POST["location"];
    $description = $_POST["description"];

    $updateValues = [
        "tittle" => $tittle,
        "schedule" => $schedule,
        "location" => $location,
        "description" => $description,
        "picture" => $picture,
        "picture2" => $picture2,
        "picture3" => $picture3
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE ekskulpil SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $ekskulIdId], function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// rabu ceria
$app->get("/rabuceria", function ($req, $res) {
    $sql = "SELECT * FROM rabuceria";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/rabuceria", function ($req, $res) {
    $sql = "INSERT INTO rabuceria (description) VALUES (?)";
    $description = $_POST["description"];
    $values = [$description];
    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/rabuceria/:id", function ($req, $res) {
    $racerId = $req->getAttribute('id');
    $description = $_POST["description"];

    $sql = "UPDATE rabuceria SET description=? WHERE ID = ?";
    $values = [$description, $racerId];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// dikmensi
$app->get("/dikmensi", function ($req, $res) {
    $sql = "SELECT * FROM dikmensi";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/dikmensi", function ($req, $res) {
    $sql = "INSERT INTO dikmensi (isiDikmensi) VALUES (?)";
    $isiDikmensi = $_POST["isiDikmensi"];
    $values = [$isiDikmensi];
    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/dikmensi/:id", function ($req, $res) {
    $dikmensiId = $req->getAttribute('id');
    $isiDikmensi = $_POST["isiDikmensi"];

    $sql = "UPDATE dikmensi SET isiDikmensi=? WHERE ID = ?";
    $values = [$isiDikmensi, $dikmensiId];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// gallery
$app->get("/galeri", function ($req, $res) {
    $sql = "SELECT ID, judulGal, docGal FROM galeri";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/galeri", function ($req, $res) {
    $sql = "INSERT INTO galeri (judulGal, docGal) VALUES (?)";
    $judulGal = $_POST["judulGal"];
    $docGal = $_FILES["docGal"]["name"][0];
    $values = [$judulGal, $docGal];
    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/galeri/:id", function ($req, $res) {
    $galeriId = $req->getAttribute('id');
    $judulGal = $_POST["judulGal"];
    $docGal = $_FILES["docGal"]["name"][0];

    $sql = "UPDATE galeri SET judulGal=?, docGal=? WHERE ID=?";
    $values = [$judulGal, $docGal, $galeriId];

    try {
        $db->query($sql, $values, function ($err, $data) use ($res) {
            if ($err) {
                echo "Database error: " . $err;
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }

            if ($data->affectedRows === 0) {
                return $res->status(404)->json(["error" => "News not found"]);
            }

            return $res->json([
                "Status" => "Success",
                "message" => "News updated successfully"
            ]);
        });
    } catch (Exception $error) {
        echo "Unexpected error: " . $error;
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// siswa
$app->get("/siswa", function ($req, $res) use ($db) {
    $sql = "SELECT * FROM student";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) {
            return $res->json($err);
        }
        return $res->json($data);
    });
});

$app->get("/siswa/download/:filename", function ($req, $res) use ($path) {
    $fileName = $req->params['filename'];
    $filePath = $path->join(__DIR__, "file", $fileName);
    $res->sendFile($filePath, function ($err) use ($res) {
        if ($err) {
            console . error("Error sending file:", $err);
            $res->status($err->status)->end();
        } else {
            echo "File sent successfully:", $fileName;
        }
    });
});

$app->post("/admin/siswa", function ($req, $res) use ($db) {
    $sql = "INSERT INTO student (nama, kelas, nis, alamat, sakit, izin, tanpaKet, dokumen, fotoMurid, status) VALUES (?)";
    $nama = $req->body('nama');
    $kelas = $req->body('kelas');
    $nis = $req->body('nis');
    $alamat = $req->body('alamat');
    $sakit = $req->body('sakit');
    $izin = $req->body('izin');
    $tanpaKet = $req->body('tanpaKet');
    $dokumen = $req->files['dokumen'][0]->filename;
    $fotoMurid = $req->files['fotoMurid'][0]->filename;
    $status = $req->body('status');
    $values = [
        $nama,
        $kelas,
        $nis,
        $alamat,
        $sakit,
        $izin,
        $tanpaKet,
        $dokumen,
        $fotoMurid,
        $status
    ];
    try {
        $db->query($sql, [$values], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/siswa/:id", function ($req, $res) use ($db) {
    $siswaId = $req->params['id'];
    $dokumen = $req->files['dokumen'] ? $req->files['dokumen'][0]->filename : null;
    $fotoMurid = $req->files['fotoMurid'] ? $req->files['fotoMurid'][0]->filename : null;
    $nama = $req->body('nama');
    $kelas = $req->body('kelas');
    $nis = $req->body('nis');
    $alamat = $req->body('alamat');
    $sakit = $req->body('sakit');
    $izin = $req->body('izin');
    $tanpaKet = $req->body('tanpaKet');
    $status = $req->body('status');

    $updateValues = [
        'nama' => $nama,
        'kelas' => $kelas,
        'nis' => $nis,
        'alamat' => $alamat,
        'sakit' => $sakit,
        'izin' => $izin,
        'tanpaKet' => $tanpaKet,
        'dokumen' => $dokumen,
        'fotoMurid' => $fotoMurid,
        'status' => $status
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE student SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $siswaId], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// denahruang
$app->get("/denahruang", function ($req, $res) use ($db) {
    $sql = "SELECT * FROM denahruang";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) {
            return $res->json($err);
        }
        return $res->json($data);
    });
});

$app->post("/admin/denahruang", function ($req, $res) use ($db) {
    $sql = "INSERT INTO denahruang (fotoDenah) VALUES (?)";
    $fotoDenah = $req->files['fotoDenah'][0]->filename;
    $values = [$fotoDenah];
    try {
        $db->query($sql, [$values], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/denahruang/:id", function ($req, $res) use ($db) {
    $denahRuangId = $req->params['id'];
    $fotoDenah = $req->files['fotoDenah'] ? $req->files['fotoDenah'][0]->filename : null;

    $updateValues = [
        'fotoDenah' => $fotoDenah
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE denahruang SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $denahRuangId], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

// denahdetail
$app->get("/denahdetail", function ($req, $res) use ($db) {
    $sql = "SELECT * FROM denahdetail";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/denahdetail", function ($req, $res) use ($db) {
    $sql = "INSERT INTO denahdetail (nama, deskripsi, foto) VALUES (?)";

    $foto = $req->files["foto"][0]->filename;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];
    $values = [$nama, $deskripsi, $foto];
    try {
        $db->query($sql, [$values], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/denahdetail/:id", function ($req, $res) use ($db) {
    $denahDetailId = $req->params["id"];
    $foto = $req->files["foto"] ? $req->files["foto"][0]->filename : null;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];

    $updateValues = [
        "foto" => $foto,
        "nama" => $nama,
        "deskripsi" => $deskripsi,
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE denahdetail SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $denahDetailId], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->get("/denahdetail1", function ($req, $res) use ($db) {
    $sql = "SELECT * FROM denahdetail1";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/denahdetail1", function ($req, $res) use ($db) {
    $sql = "INSERT INTO denahdetail1 (nama, deskripsi, foto) VALUES (?)";

    $foto = $req->files["foto"][0]->filename;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];
    $values = [$nama, $deskripsi, $foto];
    try {
        $db->query($sql, [$values], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/denahdetail1/:id", function ($req, $res) use ($db) {
    $denahDetailId = $req->params["id"];
    $foto = $req->files["foto"] ? $req->files["foto"][0]->filename : null;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];

    $updateValues = [
        "foto" => $foto,
        "nama" => $nama,
        "deskripsi" => $deskripsi,
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE denahdetail1 SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $denahDetailId], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->get("/denahdetail2", function ($req, $res) use ($db) {
    $sql = "SELECT * FROM denahdetail";
    $db->query($sql, function ($err, $data) use ($res) {
        if ($err) return $res->json($err);
        return $res->json($data);
    });
});

$app->post("/admin/denahdetail2", function ($req, $res) use ($db) {
    $sql = "INSERT INTO denahdetail2 (nama, deskripsi, foto) VALUES (?)";

    $foto = $req->files["foto"][0]->filename;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];
    $values = [$nama, $deskripsi, $foto];
    try {
        $db->query($sql, [$values], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->put("/admin/denahdetail2/:id", function ($req, $res) use ($db) {
    $denahDetailId = $req->params["id"];
    $foto = $req->files["foto"] ? $req->files["foto"][0]->filename : null;
    $nama = $req->body["nama"];
    $deskripsi = $req->body["deskripsi"];

    $updateValues = [
        "foto" => $foto,
        "nama" => $nama,
        "deskripsi" => $deskripsi,
    ];

    foreach ($updateValues as $key => $value) {
        if ($value === null || $value === undefined) {
            unset($updateValues[$key]);
        }
    }

    $sql = "UPDATE denahdetail2 SET ? WHERE ID = ?";
    try {
        $db->query($sql, [$updateValues, $denahDetailId], function ($err, $data) use ($res) {
            if ($err) {
                console . error("Database error:", $err);
                return $res->status(500)->json(["error" => "Internal Server Error"]);
            }
            return $res->json($data);
        });
    } catch (Exception $error) {
        console . error("Unexpected error:", $error);
        return $res->status(500)->json(["error" => "Internal Server Error"]);
    }
});

$app->listen();
