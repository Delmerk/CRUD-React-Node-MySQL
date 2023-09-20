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
	const name = req.body.name;
	const age = req.body.age;
	const country = req.body.country;
	const cargo = req.body.cargo;
	const salario = req.body.salario;

	conexion.query(
		"INSERT INTO empleados (name, age, country, cargo, salario) VALUES (?,?,?,?,?)",
		[name, age, country, cargo, salario],
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
	const id = req.body.id;
	const name = req.body.name;
	const age = req.body.age;
	const country = req.body.country;
	const cargo = req.body.cargo;
	const salario = req.body.salario;

	conexion.query(
		"UPDATE empleados SET name=?, age=?, country=?, cargo=?, salario=? WHERE id=?",
		[name, age, country, cargo, salario, id],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.delete("/delete/:id", (req, res) => {
	// id enviado mediante parametros
	const id = req.params.id;

	conexion.query(
		"DELETE from empleados WHERE id=?",
		id,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.listen(3310, () => {
	console.log("El servidor esta en línea");
});

//Exportamos el objeto con los datos de la conexión
// module.exports = { conexion };
