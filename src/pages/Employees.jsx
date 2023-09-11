import { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import config from "../data/config.json"
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';



function Employees() {
  const [employeesLS, setEmployeesLS] = useState(JSON.parse(localStorage.getItem("employeesLS")) || []);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const idRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const avatarRef = useRef();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');


  

  // TODO: Load data from backend service
  useEffect(() => {
    fetch(config.employeesDbURL)
      .then((res) => res.json())
      .then((json) => {
        setEmployees(json.data);
      })
  }, []);

  const addEmployee = () => {
    // TODO: Add validations
    // TODO: Add an employee to the table
    if (nameRef.current.value === "") {
      setMessage("Please enter employees name.");
    } else if (idRef.current.value === "") {
      setMessage("Please enter ID.")
    } else if (emailRef.current.value === "") {
      setMessage("Please enter email.");
    } else if (avatarRef.current.value === "") {
      setMessage("Please enter avatar URL.");
    } else {
      setMessage("Employee added " + nameRef.current.value)
      employeesLS.push({
        id: Number(idRef.current.value),
        email: emailRef.current.value,
        first_name: nameRef.current.value,
        avatar: avatarRef.current.value 
      });
      localStorage.setItem("employeesLS", JSON.stringify(employeesLS))
      setEmployeesLS(employeesLS.slice());
    }
  };

  const deleteEmployee = (id) => {
    // TODO: Delete an employee from the table

    employees.splice(id, 1);
    setEmployees([...employees]); // Create a new array to trigger React update
    localStorage.setItem("employees", JSON.stringify(employees));
    setMessage("Employee deleted!");
  }

  const deleteEmployeeLS = (index) => {
    // TODO: Delete an employee from the table

    employeesLS.splice(index, 1);
    setEmployeesLS([...employeesLS]); // Create a new array to trigger React update
    localStorage.setItem("employeesLS", JSON.stringify(employeesLS));
    setMessage("Employee deleted!");
  }
     


  const validateName = () => {
    if (!name) {
      setNameError('Name is required');
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      setNameError('Name should contain only letters and spaces');
    } else {
      setNameError('');
    }
  };

  const validateEmail = () => {
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateName();
    validateEmail();

    if (!nameError && !emailError) {
      // Perform your desired action here, e.g., submit the form
      console.log('Name:', name);
      console.log('Email:', email);
    }
  };
  

  return (
    <div>
      <h3>{message}</h3>
      <div className="container">
        <h2 className="mb-4">Employees</h2>
        <Table className="table table-hover table-bordered table-sortable">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              {/* <!-- TODO: Add a column for an avatar --> */}
              <th scope="col">Avatar</th>
              <th scope="col">Actions</th>
              <th scope="col"><img src="" alt="" /></th>
            </tr>
          </thead>
          <tbody>
               {employees.map((employee, id) => (
                    <tr key={id}>
                      <td className="firstColumn">{employee.id}</td>
                      <td>{employee.first_name}</td>
                      <td>{employee.email}</td>
                      <td><img src={employee.avatar} alt="" /></td>
                      <td><Button onClick={() => deleteEmployee(id)} type="button" variant="danger">
                            Delete
                          </Button>
                      </td>
                    </tr>                  
                  ))}
                  {employeesLS.map((employee, index) => (
                    <tr key={index}>
                      <td className="firstColumn">{employee.id}</td>
                      <td>{employee.first_name}</td>
                      <td>{employee.email}</td>
                      <td><img src={employee.avatar} alt="" /></td>
                      <td><Button onClick={() => deleteEmployeeLS(index)} type="button" variant="danger">
                            Delete
                          </Button>
                      </td>
                    </tr>                  
                  ))}
            <tr onSubmit={handleSubmit} className="input-row">
              <td>
                <input ref={idRef} type="number" placeholder="ID" className="form-control" required/>
              </td>
              <td>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  placeholder="Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={validateName}
                />
                {nameError && <div className="error">{nameError}</div>}

              </td>
              <td>
                <input
                  ref={emailRef}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="form-control"
                  onBlur={validateEmail}
                />
                {emailError && <div className="error">{emailError}</div>}
              </td>
              <td>
                <input 
                  ref={avatarRef} 
                  type="text" 
                  placeholder="avatar URL"
                  required/>
              </td>
              <td>
                <Button onClick={() => addEmployee()} type="submit" variant="success">
                  Add
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Employees;

// 1.	At the moment, the “Employees” view displays static data. You need to make it load and display data from the backend service
//  and add a column for an avatar (note that the avatar should be displayed as an image). 
//  The URL to load data is https://reqres.in/api/users.
