import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import session from "express-session";
import historyApiFallback from "connect-history-api-fallback";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./file/"));
app.use(cors());
app.use(historyApiFallback());
app.use(express.static("src"));
app.use(
  session({
    secret: "rahasia",
    resave: false,
    saveUninitialized: false,
  })
);
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.API_KEY,
});

// Use express-session middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./file/");
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const maxSize = 5 * 1024 * 1024;
var upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .png, .jgp .jpeg .docx .pdf format allowed"));
    }
  },
  limits: { fileSize: maxSize },
});

// admin login
app.post("/admin/login", (req, res) => {
  const { userName, passWord } = req.body;
  const sql = "SELECT * FROM useradmin WHERE userName = ? AND passWord = ?";
  db.query(sql, [userName, passWord], (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.json({
        success: false,
        error: "Terjadi kesalahan pada server",
      });
    }
    if (data.length > 0) {
      // Autentikasi berhasil
      req.session.authenticated = true;
      return res.json({ success: true });
    } else {
      // Autentikasi gagal
      return res.json({
        success: false,
        error: "Username atau password salah",
      });
    }
  });
});

// beranda
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.get("/", (req, res) => {
  app.use("/", express.static(path.join(__dirname, "image")));
  const sql = "SELECT * FROM home";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(data);
  });
});

app.post(
  "/admin/beranda",
  upload.fields([{ name: "kImg" }, { name: "bHeadImg" }]),
  (req, res) => {
    const sql = "INSERT INTO home (bHeadImg, kImg, description) VALUES (?)";
    const kImg = req.files["kImg"] ? req.files["kImg"][0]?.filename : null;
    const bHeadImg = req.files["bHeadImg"]
      ? req.files["bHeadImg"][0]?.filename
      : null;
    const description = req.body.description || null;

    const values = [bHeadImg, kImg, description];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/beranda/:id",
  upload.fields([{ name: "kImg" }, { name: "bHeadImg" }]),
  (req, res) => {
    const homeId = req.params.id;
    let sql = "UPDATE home SET ";
    const values = [];

    if (req.files["bHeadImg"]) {
      sql += "bHeadImg = ?, ";
      values.push(req.files["bHeadImg"][0]?.filename);
    }

    if (req.files["kImg"]) {
      sql += "kImg = ?, ";
      values.push(req.files["kImg"][0]?.filename);
    }

    if (req.body.description) {
      sql += "description = ?, ";
      values.push(req.body.description);
    }

    sql = sql.slice(0, -2);

    sql += " WHERE ID = ?";
    values.push(homeId);

    try {
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json({ Status: "Success" });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// profil
app.get("/profil", (req, res) => {
  const sql = "SELECT ID, kataPen, visimisi, struktur FROM profile";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(data);
  });
});
app.post("/admin/profil", upload.fields([{ name: "struktur" }]), (req, res) => {
  const sql = "INSERT INTO profile (kataPen, visimisi, struktur) VALUES (?)";
  const struktur = req.files["struktur"][0]?.filename;
  const kataPen = req.body.kataPen;
  const visimisi = req.body.visimisi;
  const values = [kataPen, visimisi, struktur];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put(
  "/admin/profil/:id",
  upload.fields([{ name: "struktur" }]),
  (req, res) => {
    const profilId = req.params.id;
    let sql = "UPDATE profile SET ";
    const values = [];

    if (req.files["struktur"]) {
      sql += "struktur = ?, ";
      values.push(req.files["struktur"][0]?.filename);
    }

    if (req.body.kataPen) {
      sql += "kataPen = ?, ";
      values.push(req.body.kataPen);
    }

    if (req.body.visimisi) {
      sql += "visimisi = ?, ";
      values.push(req.body.visimisi);
    }

    sql = sql.slice(0, -2);

    sql += " WHERE ID = ?";
    values.push(profilId);

    try {
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json({ Status: "Success" });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// staff
app.get("/guru", (req, res) => {
  const sql =
    "SELECT ID, name, position, education, achievement, fotoGuru FROM teacher";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/guru", upload.fields([{ name: "fotoGuru" }]), (req, res) => {
  const sql =
    "INSERT INTO teacher (name, position, education, achievement, fotoGuru) VALUES (?)";
  const fotoGuru = req.files["fotoGuru"][0]?.filename;
  const name = req.body.name;
  const position = req.body.position;
  const education = req.body.education;
  const achievement = req.body.achievement;
  const values = [name, position, education, achievement, fotoGuru];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put(
  "/admin/guru/:id",
  upload.fields([{ name: "fotoGuru" }]),
  (req, res) => {
    const teacherId = req.params.id;
    const fotoGuru = req.files["fotoGuru"]
      ? req.files["fotoGuru"][0]?.filename
      : null;
    const name = req.body.name;
    const position = req.body.position;
    const education = req.body.education;
    const achievement = req.body.achievement;

    const updateValues = {
      name,
      position,
      education,
      achievement,
      fotoGuru,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE teacher SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, teacherId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// learning
app.get("/organisasi", (req, res) => {
  const sql = "SELECT * FROM learning";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/organisasi", upload.none(), (req, res) => {
  const sql =
    "INSERT INTO learning (intrakrikuler, kokurikuler, ekstrakurikuler) VALUES (?)";
  const intrakrikuler = req.body.intrakrikuler;
  const kokurikuler = req.body.kokurikuler;
  const ekstrakurikuler = req.body.ekstrakurikuler;
  const values = [intrakrikuler, kokurikuler, ekstrakurikuler];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin/organisasi/:id", upload.none(), (req, res) => {
  const learningId = req.params.id;
  const intrakrikuler = req.body.intrakrikuler;
  const kokurikuler = req.body.kokurikuler;
  const ekstrakurikuler = req.body.ekstrakurikuler;

  const sql =
    "UPDATE learning SET intrakrikuler = ?, kokurikuler = ?, ekstrakurikuler = ? WHERE ID = ?";
  const values = [intrakrikuler, kokurikuler, ekstrakurikuler, learningId];

  try {
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// berita
app.get("/berita/:id", (req, res) => {
  const sql = "SELECT ID, sampul, judulBerita, isiBerita, date FROM news";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/berita/", upload.fields([{ name: "sampul" }]), (req, res) => {
  const sql =
    "INSERT INTO news (sampul, judulBerita, isiBerita, date) VALUES (?)";
  const sampul = req.files["sampul"][0]?.filename;
  const judulBerita = req.body.judulBerita;
  const isiBerita = req.body.isiBerita;
  const date = req.body.date;
  const values = [sampul, judulBerita, isiBerita, date];

  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put(
  "/admin/berita/:id",
  upload.fields([{ name: "sampul" }]),
  (req, res) => {
    const newsId = req.params.id;
    const sql =
      "UPDATE news SET sampul=?, judulBerita=?, isiBerita=?, date=? WHERE ID=?";

    const sampul = req.files["sampul"]
      ? req.files["sampul"][0]?.filename
      : null;
    const judulBerita = req.body.judulBerita;
    const isiBerita = req.body.isiBerita;
    const date = req.body.date;
    const values = [sampul, judulBerita, isiBerita, date, newsId];

    try {
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.affectedRows === 0) {
          return res.status(404).json({ error: "News not found" });
        }

        return res.json({
          Status: "Success",
          message: "News updated successfully",
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// pengumuman
app.get("/pengumuman/:id", (req, res) => {
  const sql = "SELECT id, descNotice, document, judul, date FROM notice";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/pengumuman/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "file", fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).end();
    } else {
      console.log("File sent successfully:", fileName);
    }
  });
});

app.post(
  "/admin/pengumuman",
  upload.fields([{ name: "document" }]),
  (req, res) => {
    const sql =
      "INSERT INTO notice (descNotice, document, judul, date) VALUES (?)";
    const document = req.files["document"][0]?.filename;
    const descNotice = req.body.descNotice;
    const judul = req.body.judul;
    const date = req.body.date;
    const values = [descNotice, document, judul, date];

    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/pengumuman/:id",
  upload.fields([{ name: "sampul" }]),
  (req, res) => {
    const noticeId = req.params.id;
    const sql =
      "UPDATE notice SET descNotice=?, document=?, judul=?, date=? WHERE ID=?";

    const document = req.files["document"]
      ? req.files["document"][0]?.filename
      : null;
    const judul = req.body.judul;
    const date = req.body.date;
    const values = [document, judul, date, noticeId];

    try {
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.affectedRows === 0) {
          return res.status(404).json({ error: "News not found" });
        }

        return res.json({
          Status: "Success",
          message: "News updated successfully",
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete("/admin/berita/:id", (req, res) => {
  const sql = "delete from news where id = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// ekstrakurikuler
app.get("/ekstrakurikuler/favorite", (req, res) => {
  const sql = "SELECT * FROM ekskulfav";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/ekstrakurikuler/pilihan", (req, res) => {
  const sql = "SELECT * FROM ekskulpil";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post(
  "/admin/ekstrakurikuler/favorite",
  upload.fields([
    { name: "picture" },
    { name: "picture2" },
    { name: "picture3" },
  ]),
  (req, res) => {
    const sql =
      "INSERT INTO ekskulfav (tittle, schedule, location, description, picture, picture2, picture3) VALUES (?)";
    const picture = req.files["picture"][0]?.filename;
    const picture2 = req.files["picture2"][0]?.filename;
    const picture3 = req.files["picture3"][0]?.filename;
    const tittle = req.body.tittle;
    const schedule = req.body.schedule;
    const location = req.body.location;
    const description = req.body.description;
    const values = [
      tittle,
      schedule,
      location,
      description,
      picture,
      picture2,
      picture3,
    ];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post(
  "/admin/ekstrakurikuler/pilihan",
  upload.fields([
    { name: "picture" },
    { name: "picture2" },
    { name: "picture3" },
  ]),
  (req, res) => {
    const sql =
      "INSERT INTO ekskulpil (tittle, schedule, location, description, picture, picture2, picture3) VALUES (?)";
    const picture = req.files["picture"][0]?.filename;
    const picture2 = req.files["picture2"][0]?.filename;
    const picture3 = req.files["picture3"][0]?.filename;
    const tittle = req.body.tittle;
    const schedule = req.body.schedule;
    const location = req.body.location;
    const description = req.body.description;
    const values = [
      tittle,
      schedule,
      location,
      description,
      picture,
      picture2,
      picture3,
    ];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/ekstrakurikuler/favorite/:id",
  upload.fields([
    { name: "picture" },
    { name: "picture2" },
    { name: "picture3" },
  ]),
  (req, res) => {
    const ekskulIdId = req.params.id;
    const picture = req.files["picture"]
      ? req.files["picture"][0]?.filename
      : null;
    const picture2 = req.files["picture2"]
      ? req.files["picture2"][0]?.filename
      : null;
    const picture3 = req.files["picture3"]
      ? req.files["picture3"][0]?.filename
      : null;
    const tittle = req.body.tittle;
    const schedule = req.body.schedule;
    const location = req.body.location;
    const description = req.body.description;

    const updateValues = {
      tittle,
      schedule,
      location,
      description,
      picture,
      picture2,
      picture3,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE ekskulfav SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, ekskulIdId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/ekstrakurikuler/pilihan/:id",
  upload.fields([
    { name: "picture" },
    { name: "picture2" },
    { name: "picture3" },
  ]),
  (req, res) => {
    const ekskulIdId = req.params.id;
    const picture = req.files["picture"]
      ? req.files["picture"][0]?.filename
      : null;
    const picture2 = req.files["picture2"]
      ? req.files["picture2"][0]?.filename
      : null;
    const picture3 = req.files["picture3"]
      ? req.files["picture3"][0]?.filename
      : null;
    const tittle = req.body.tittle;
    const schedule = req.body.schedule;
    const location = req.body.location;
    const description = req.body.description;

    const updateValues = {
      tittle,
      schedule,
      location,
      description,
      picture,
      picture2,
      picture3,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE ekskulpil SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, ekskulIdId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// rabu ceria
app.get("/rabuceria", (req, res) => {
  const sql = "SELECT * FROM rabuceria";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/rabuceria", upload.none(), (req, res) => {
  const sql = "INSERT INTO rabuceria (description) VALUES (?)";
  const description = req.body.description;
  const values = [description];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin/rabuceria/:id", upload.none(), (req, res) => {
  const racerId = req.params.id;
  const description = req.body.description;

  const sql = "UPDATE rabuceria SET description=? WHERE ID = ?";
  const values = [description, racerId];

  try {
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// dikmensi
app.get("/dikmensi", (req, res) => {
  const sql = "SELECT * FROM dikmensi";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/dikmensi", upload.none(), (req, res) => {
  const sql = "INSERT INTO dikmensi (isiDikmensi) VALUES (?)";
  const isiDikmensi = req.body.isiDikmensi;
  const values = [isiDikmensi];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin/dikmensi/:id", upload.none(), (req, res) => {
  const dikmensiId = req.params.id;
  const isiDikmensi = req.body.isiDikmensi;

  const sql = "UPDATE dikmensi SET isiDikmensi=? WHERE ID = ?";
  const values = [isiDikmensi, dikmensiId];

  try {
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// gallery
app.get("/galeri", (req, res) => {
  const sql = "SELECT ID, judulGal, docGal FROM galeri";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/admin/galeri", upload.fields([{ name: "docGal" }]), (req, res) => {
  const sql = "INSERT INTO galeri (judulGal, docGal) VALUES (?)";
  const judulGal = req.body.judulGal;
  const docGal = req.files["docGal"][0]?.filename;
  const values = [judulGal, docGal];
  try {
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put(
  "/admin/galeri/:id",
  upload.fields([{ name: "docGal" }]),
  (req, res) => {
    const galeriId = req.params.id;
    const judulGal = req.body.judulGal;
    const docGal = req.files["docGal"]
      ? req.files["docGal"][0]?.filename
      : null;
    const sql = "UPDATE galeri SET judulGal=?, docGal=? WHERE ID=?";
    const values = [judulGal, docGal, galeriId];

    try {
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.affectedRows === 0) {
          return res.status(404).json({ error: "News not found" });
        }

        return res.json({
          Status: "Success",
          message: "News updated successfully",
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// siswa
app.get("/siswa", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/siswa/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "file", fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).end();
    } else {
      console.log("File sent successfully:", fileName);
    }
  });
});

app.post(
  "/admin/siswa",
  upload.fields([{ name: "fotoMurid" }, { name: "dokumen" }]),
  (req, res) => {
    const sql =
      "INSERT INTO student (nama, kelas, nis, alamat, sakit, izin, tanpaKet, dokumen, fotoMurid, status) VALUES (?)";

    const nama = req.body.nama;
    const kelas = req.body.kelas;
    const nis = req.body.nis;
    const alamat = req.body.alamat;
    const sakit = req.body.sakit;
    const izin = req.body.izin;
    const tanpaKet = req.body.tanpaKet;
    const dokumen = req.files["dokumen"][0]?.filename;
    const fotoMurid = req.files["fotoMurid"][0]?.filename;
    const status = req.body.status;
    const values = [
      nama,
      kelas,
      nis,
      alamat,
      sakit,
      izin,
      tanpaKet,
      dokumen,
      fotoMurid,
      status,
    ];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/siswa/:id",
  upload.fields([{ name: "fotoMurid" }, { name: "dokumen" }]),
  (req, res) => {
    const siswaId = req.params.id;
    const dokumen = req.files["dokumen"]
      ? req.files["dokumen"][0]?.filename
      : null;
    const fotoMurid = req.files["fotoMurid"]
      ? req.files["fotoMurid"][0]?.filename
      : null;
    const nama = req.body.nama;
    const kelas = req.body.kelas;
    const nis = req.body.nis;
    const alamat = req.body.alamat;
    const sakit = req.body.sakit;
    const izin = req.body.izin;
    const tanpaKet = req.body.tanpaKet;
    const status = req.body.status;

    const updateValues = {
      nama,
      kelas,
      nis,
      alamat,
      sakit,
      izin,
      tanpaKet,
      dokumen,
      fotoMurid,
      status,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE student SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, siswaId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// denahruang
app.get("/denahruang", (req, res) => {
  const sql = "SELECT * FROM denahruang";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post(
  "/admin/denahruang",
  upload.fields([{ name: "fotoDenah" }]),
  (req, res) => {
    const sql = "INSERT INTO denahruang (fotoDenah) VALUES (?)";

    const fotoDenah = req.files["fotoDenah"][0]?.filename;
    const values = [fotoDenah];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/denahruang/:id",
  upload.fields([{ name: "fotoDenah" }]),
  (req, res) => {
    const denahRuangId = req.params.id;
    const fotoDenah = req.files["fotoDenah"]
      ? req.files["fotoDenah"][0]?.filename
      : null;

    const updateValues = {
      fotoDenah,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE denahruang SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, denahRuangId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// denahdetail
app.get("/denahdetail", (req, res) => {
  const sql = "SELECT * FROM denahdetail";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post(
  "/admin/denahdetail",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const sql = "INSERT INTO denahdetail (nama, deskripsi, foto) VALUES (?)";

    const foto = req.files["foto"][0]?.filename;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;
    const values = [nama, deskripsi, foto];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/denahdetail/:id",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const denahDetailId = req.params.id;
    const foto = req.files["foto"] ? req.files["foto"][0]?.filename : null;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;

    const updateValues = {
      foto,
      nama,
      deskripsi,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE denahdetail SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, denahDetailId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/denahdetail1", (req, res) => {
  const sql = "SELECT * FROM denahdetail1";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post(
  "/admin/denahdetail1",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const sql = "INSERT INTO denahdetail1 (nama, deskripsi, foto) VALUES (?)";

    const foto = req.files["foto"][0]?.filename;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;
    const values = [nama, deskripsi, foto];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/denahdetail1/:id",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const denahDetailId = req.params.id;
    const foto = req.files["foto"] ? req.files["foto"][0]?.filename : null;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;

    const updateValues = {
      foto,
      nama,
      deskripsi,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE denahdetail1 SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, denahDetailId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/denahdetail2", (req, res) => {
  const sql = "SELECT * FROM denahdetail2";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post(
  "/admin/denahdetail2",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const sql = "INSERT INTO denahdetail2 (nama, deskripsi, foto) VALUES (?)";

    const foto = req.files["foto"][0]?.filename;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;
    const values = [nama, deskripsi, foto];
    try {
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/admin/denahdetail2/:id",
  upload.fields([{ name: "foto" }]),
  (req, res) => {
    const denahDetailId = req.params.id;
    const foto = req.files["foto"] ? req.files["foto"][0]?.filename : null;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;

    const updateValues = {
      foto,
      nama,
      deskripsi,
    };

    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === null || updateValues[key] === undefined) {
        delete updateValues[key];
      }
    });

    const sql = "UPDATE denahdetail2 SET ? WHERE ID = ?";
    try {
      db.query(sql, [updateValues, denahDetailId], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
app.listen(8080, () => {
  console.log(`Server Running at http://localhost:${port}`);
});
