import { useState } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
// CREADO POR DELMERK ESCOBAR SOLARTE
// Con ayuda de este tutorial y documentación: https://www.youtube.com/watch?v=U1u2jNYXmBw

function App() {
	const [nombre, setNombre] = useState("");
	const [edad, setEdad] = useState();
	const [pais, setPais] = useState("");
	const [cargo, setCargo] = useState("");
	const [anios, setAnios] = useState();
	const [idempleado, setIdEmpleado] = useState();

	const [editar, setEditar] = useState(false);

	const [empleadosList, setEmpleados] = useState([]);

	const addEmpleados = () => {
		Axios.post("http://localhost:3001/create", {
			nombre: nombre,
			edad: edad,
			pais: pais,
			cargo: cargo,
			anios: anios,
		}).then(() => {
			getEmpleados();
			cleanFields();
			Swal.fire({
				title: "<strong>Registro exitoso!</strong>",
				html:
					"<i>El empleado <strong>" +
					nombre +
					"</strong> fue registrado satisfactoriamente.</i>",
				icon: "success",
				timer: 2000,
			}).catch(function (error) {
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
		});
	};

	const updateEmpleados = () => {
		Axios.put("http://localhost:3001/update", {
			idempleado: idempleado,
			nombre: nombre,
			edad: edad,
			pais: pais,
			cargo: cargo,
			anios: anios,
		}).then(() => {
			getEmpleados();
			cleanFields();
			Swal.fire({
				title: "<strong>Actualización exitosa!</strong>",
				html:
					"<i>El empleado <strong>" +
					nombre +
					"</strong> fue actualizado satisfactoriamente.</i>",
				icon: "success",
				timer: 3000,
			}).catch(function (error) {
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
		});
	};

	/*
	const deleteEmpleados = (value) => {
		Swal.fire({
			title: "<strong>Confirmar Borrado</strong>",
			html:
				"<i>¿Desea eliminar al empleado <strong>" +
				value.nombre +
				"</strong>?</i>",
			icon: "warning",
			//El si debe estar en segunda position. el primero se lo toma como false y segundo como true
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminarlo.",
		}).then((result) => {
			if (result.isConfirmed) {
				Axios.delete(`http://localhost:3001/delete/${value.idempleado}`)
					.then(() => {
						getEmpleados();
						cleanFields();
						Swal.fire({
							title: "Eliminado!",
							text: value.nombre + " eliminado satisfactoriamente.",
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
					Axios.delete(`http://localhost:3001/delete/${value.idempleado}`).then(
						() => {
							getEmpleados();
							cleanFields();
							swalWithBootstrapButtons.fire(
								"Eliminado!",
								"El empleado <strong>" +
									value.nombre +
									"</strong> fue eliminado correctamente.",
								"success"
							);
						}
					);
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
		setNombre("");
		setEdad("");
		setPais("");
		setCargo("");
		setAnios("");
		setIdEmpleado("");

		setEditar(false);
	};

	const getEmpleados = () => {
		Axios.get("http://localhost:3001/empleados").then((response) => {
			setEmpleados(response.data);
		});
	};

	// cargar info en inputs
	const actualizarEmpleado = (value) => {
		setEditar(true);

		setNombre(value.nombre);
		setEdad(value.edad);
		setPais(value.pais);
		setCargo(value.cargo);
		setAnios(value.anios);
		setIdEmpleado(value.idempleado);
	};

	getEmpleados();

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
								setNombre(event.target.value);
							}}
							value={nombre}
							type="text"
							className="form-control"
							placeholder="Nombre"
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
								setEdad(event.target.value);
							}}
							value={edad}
							type="number"
							className="form-control"
							placeholder="Edad"
							aria-label="edad"
							aria-describedby="basic-addon1"
						/>
					</div>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">
							Pais:
						</span>
						<input
							onChange={(event) => {
								setPais(event.target.value);
							}}
							value={pais}
							type="text"
							className="form-control"
							placeholder="Pais"
							aria-label="Pais"
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
								setAnios(event.target.value);
							}}
							value={anios}
							type="text"
							className="form-control"
							placeholder="Años"
							aria-label="anios"
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
				</div>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Nombre</th>
						<th scope="col">Edad</th>
						<th scope="col">Pais</th>
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
								<tr key={value.idempleado}>
									<th>{value.idempleado}</th>
									<td>{value.nombre}</td>
									<td>{value.edad}</td>
									<td>{value.pais}</td>
									<td>{value.cargo}</td>
									<td>{value.anios}</td>
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
