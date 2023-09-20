import { useState } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
const Swal = require("sweetalert2");
// import Swal from "sweetalert2";
// CREADO POR DELMERK ESCOBAR SOLARTE
// Con ayuda de este tutorial y documentación: https://www.youtube.com/watch?v=U1u2jNYXmBw

function App() {
	const [name, setName] = useState("");
	const [age, setAge] = useState();
	const [country, setCountry] = useState("");
	const [cargo, setCargo] = useState("");
	const [salario, setSalario] = useState();
	const [id, setIdEmpleado] = useState();

	const [editar, setEditar] = useState(false);

	const [empleadosList, setEmpleados] = useState([]);

	const addEmpleados = () => {
		Axios.post("http://localhost:3310/create", {
			name: name,
			age: age,
			country: country,
			cargo: cargo,
			salario: salario,
		})
			.then(() => {
				getEmpleados();
				cleanFields();
				Swal.fire({
					title: "<strong>Registro exitoso!</strong>",
					html:
						"<i>El empleado <strong>" +
						name +
						"</strong> fue registrado satisfactoriamente.</i>",
					icon: "success",
					timer: 2000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "No se logró registrar el empleado!",
					footer:
						JSON.parse(JSON.stringify(error)).message === "Network Error"
							? "Intente más tarde."
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const updateEmpleados = () => {
		Axios.put("http://localhost:3310/update", {
			id: id,
			name: name,
			age: age,
			country: country,
			cargo: cargo,
			salario: salario,
		})
			.then(() => {
				getEmpleados();
				cleanFields();
				Swal.fire({
					title: "<strong>Actualización exitosa!</strong>",
					html:
						"<i>El empleado <strong>" +
						name +
						"</strong> fue actualizado satisfactoriamente.</i>",
					icon: "success",
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "No se logró actualizar el empleado!",
					footer:
						JSON.parse(JSON.stringify(error)).message === "Network Error"
							? "Intente más tarde."
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	/*
	const deleteEmpleados = (value) => {
		Swal.fire({
			title: "<strong>Confirmar Borrado</strong>",
			html:
				"<i>¿Desea eliminar al empleado <strong>" +
				value.name +
				"</strong>?</i>",
			icon: "warning",
			//El si debe estar en segunda position. el primero se lo toma como false y segundo como true
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminarlo.",
		}).then((result) => {
			if (result.isConfirmed) {
				Axios.delete(`http://localhost:3310/delete/${value.id}`)
					.then(() => {
						getEmpleados();
						cleanFields();
						Swal.fire({
							title: "Eliminado!",
							text: value.name + " eliminado satisfactoriamente.",
							icon: "success",
							timer: 2500,
						});
					})
					.catch(function (error) {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "No se logró eliminar el empleado!",
							footer:
								JSON.parse(JSON.stringify(error)).message === "Network Error"
									? "Intente más tarde."
									: JSON.parse(JSON.stringify(error)).message,
						});
					});
			}
		});
	};
	*/
	const eliminarEmpleados = (value) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-success",
				cancelButton: "btn btn-danger",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: "Estás seguro?",
				text: "No podrás revertir esto!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Si, eliminarlo!",
				cancelButtonText: "No, cancelar!",
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					Axios.delete(`http://localhost:3310/delete/${value.id}`).then(() => {
						getEmpleados();
						cleanFields();
						swalWithBootstrapButtons.fire(
							"Eliminado!",
							"El empleado <strong>" +
								value.name +
								"</strong> fue eliminado correctamente.",
							"success"
						);
					});
				} else if (
					/* Read more about handling dismissals below */
					result.dismiss === Swal.DismissReason.cancel
				) {
					swalWithBootstrapButtons.fire(
						"Cancelado",
						"El empleado no ha sido eliminado.",
						"error"
					);
				}
			})
			.catch(function (error) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "No se logró eliminar el empleado!",
					footer:
						JSON.parse(JSON.stringify(error)).message === "Network Error"
							? "Intente más tarde."
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const cleanFields = () => {
		setName("");
		setAge("");
		setCountry("");
		setCargo("");
		setSalario("");
		setIdEmpleado("");

		setEditar(false);
	};

	const getEmpleados = () => {
		Axios.get("http://localhost:3310/empleados").then((response) => {
			setEmpleados(response.data);
		});
	};

	// cargar info en inputs
	const actualizarEmpleado = (value) => {
		setEditar(true);

		setName(value.name);
		setAge(value.age);
		setCountry(value.country);
		setCargo(value.cargo);
		setSalario(value.salario);
		setIdEmpleado(value.id);
	};

	// getEmpleados();

	return (
		<div className="container">
			<div className="card text-center">
				<div className="card-header">Gestión de Empleados</div>
				<div className="card-body">
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Nombre:
						</span>
						<input
							/* event tiene el valor del input o campo - lo que ingreso el user */
							onChange={(event) => {
								setName(event.target.value);
							}}
							value={name}
							type="text"
							className="form-control"
							placeholder="Luz"
							aria-label="Username"
							aria-describedby="basic-addon1"
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Edad:
						</span>
						<input
							onChange={(event) => {
								setAge(event.target.value);
							}}
							value={age}
							type="number"
							className="form-control"
							placeholder="20"
							aria-label="age"
							aria-describedby="basic-addon1"
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Pais:
						</span>
						<input
							onChange={(event) => {
								setCountry(event.target.value);
							}}
							value={country}
							type="text"
							className="form-control"
							placeholder="Colombia"
							aria-label="Country"
							aria-describedby="basic-addon1"
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Cargo:
						</span>
						<input
							onChange={(event) => {
								setCargo(event.target.value);
							}}
							value={cargo}
							type="text"
							className="form-control"
							placeholder="Cargo"
							aria-label="cargo"
							aria-describedby="basic-addon1"
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Años:
						</span>
						<input
							onChange={(event) => {
								setSalario(event.target.value);
							}}
							value={salario}
							type="text"
							className="form-control"
							placeholder="3.000.000"
							aria-label="salario"
							aria-describedby="basic-addon1"
						/>
					</div>
				</div>
				<div className="card-footer text-body-secondary">
					{editar ? (
						<div>
							<button className="btn btn-success m-2" onClick={updateEmpleados}>
								Actualizar
							</button>
							<button className="btn btn-danger m-2" onClick={cleanFields}>
								Cancelar
							</button>
						</div>
					) : (
						<button className="btn btn-success m-2" onClick={addEmpleados}>
							Registrar
						</button>
					)}
					<button className="btn btn-warning m-2" onClick={getEmpleados}>
						Get Employee
					</button>
				</div>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Name</th>
						<th scope="col">Age</th>
						<th scope="col">Country</th>
						<th scope="col">Cargo</th>
						<th scope="col">Años Experiencia</th>
						<th scope="col">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{
						// cada valor o item tendrá una clave que lo rerpesenta
						empleadosList.map((value, key) => {
							// lo que va ha hacer cuando tenga un element
							return (
								<tr key={value.id}>
									<th>{value.id}</th>
									<td>{value.name}</td>
									<td>{value.age}</td>
									<td>{value.country}</td>
									<td>{value.cargo}</td>
									<td>{value.salario}</td>
									<td>
										<div
											className="btn-group"
											role="group"
											aria-label="Basic example"
										>
											<button
												onClick={() => {
													actualizarEmpleado(value);
												}}
												type="button"
												className="btn btn-warning"
											>
												Editar
											</button>
											<button
												onClick={() => {
													eliminarEmpleados(value);
												}}
												type="button"
												className="btn btn-danger"
											>
												Eliminar
											</button>
										</div>
									</td>
								</tr>
							);
						})
					}
				</tbody>
			</table>
		</div>
	);
}

export default App;
