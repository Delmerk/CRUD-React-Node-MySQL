// referenciar express
const express = require("express");
const app = express();
const cors = require("cors");
//Llamar al componente de mysql
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

//Establecer los parámetros de la conexión
const conexion = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "store_dk",
});

//Nos conectamos con la base
conexion.connect(function (error) {
	if (error) throw error;
	console.log("Conectado a la base de datos");
});

app.post("/create", (req, res) => {
	// datos que nos envian desde el form
	const nombre = req.body.nombre;
	const edad = req.body.edad;
	const pais = req.body.pais;
	const cargo = req.body.cargo;
	const anios = req.body.anios;

	conexion.query(
		"INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?,?,?,?,?)",
		[nombre, edad, pais, cargo, anios],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.get("/empleados", (req, res) => {
	conexion.query("SELECT * from empleados", (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

app.put("/update", (req, res) => {
	// datos que nos envian desde el form
	const idempleado = req.body.idempleado;
	const nombre = req.body.nombre;
	const edad = req.body.edad;
	const pais = req.body.pais;
	const cargo = req.body.cargo;
	const anios = req.body.anios;

	conexion.query(
		"UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, anios=? WHERE idempleado=?",
		[nombre, edad, pais, cargo, anios, idempleado],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.delete("/delete/:idempleado", (req, res) => {
	// id enviado mediante parametros
	const idempleado = req.params.idempleado;

	conexion.query(
		"DELETE from empleados WHERE idempleado=?",
		idempleado,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.listen(3001, () => {
	console.log("El servidor esta en línea");
});

//Exportamos el objeto con los datos de la conexión
// module.exports = { conexion };
