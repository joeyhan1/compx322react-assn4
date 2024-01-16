import React, { useState, useEffect } from 'react';

const ProjectManager = () => {
  //State variables (inside the array two parameters, first one is state variable and the other one is the updater function)
  const [projects, setProjects] = useState([]); //Storing and setting the project data (Use state is an array)
  const [sortOption, setSortOption] = useState(''); //Selecting sort option
  const [showForm, setShowForm] = useState(false); //Toggle form visibility
  const [searchTerm, setSearchTerm] = useState(''); //Search term for filtering projects
  const [formData, setFormData] = useState({ //Form data for creating new projects to add to the list
    projectName: '',
    projectIdentifier: '',
    projectDescription: '',
    startDate: '',
    endDate: ''
  });

  //Use Effect makes it so that it does the thing inside after the react application renders
  useEffect(() => {
    const getInitialProjects = async () => {
      try {
        //Getting the data from the JSON file
        const response = await fetch('/data.json');
        const jsonData = await response.json();

        //Set the retrieved data to the state
        setProjects(jsonData);
      } catch (error) {
        console.error('Error loading initial projects:', error);
      }
    };

    getInitialProjects();
  }, []);

  //Used to handle input changes that happen in the form
  const handleChangeInputs = (e) => {
    //"e" is the event object when input field are modified
    //Update the form data in the state with the new values entered by the user
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Used to handle form submissions
  const handleSubmit = (e) => {
    //Prevent the default behaviour of an event
    e.preventDefault();
    const newProject = {
      projectName: formData.projectName,
      projectIdentifier: formData.projectIdentifier,
      description: formData.projectDescription,
      start_date: formData.startDate,
      end_date: formData.endDate
    };

    //Check whether the project ID exists in the project list
    const checkID = projects.some(
      //Loop through all the project in the projects array(state)
      (project) => project.projectIdentifier === newProject.projectIdentifier
    );

    if (checkID) {
      alert('A project with the same ID already exists. Please enter a unique ID.');
    } else {
      let addProjects;
      
      //Adding new project and sorting it with the selected sort option
      if (sortOption === 'name-asc') {
        addProjects = [...projects, newProject].sort((a, b) =>
          a.projectName.localeCompare(b.projectName)
        );
      } else if (sortOption === 'name-desc') {
        addProjects = [...projects, newProject].sort((a, b) =>
          b.projectName.localeCompare(a.projectName)
        );
      } else if (sortOption === 'date-asc') {
        addProjects = [...projects, newProject].sort((a, b) =>
          a.start_date.localeCompare(b.start_date)
        );
      } else if (sortOption === 'date-desc') {
        addProjects = [...projects, newProject].sort((a, b) =>
          b.start_date.localeCompare(a.start_date)
        );
      } else {
        addProjects = [...projects, newProject];
      }

      //Updating the projects state and resetting the form data to be empty
      setProjects(addProjects);
      setFormData({
        projectName: '',
        projectIdentifier: '',
        projectDescription: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  //Used to handle project deletion
  const handleDelete = (projectIdentifier) => {
    //Removing the project with the project identifier given from the projects state
    const updatedProjects = projects.filter((project) => project.projectIdentifier !== projectIdentifier);
    setProjects(updatedProjects);
  };

  //Used to handle change in sorted options
  const handleSort = (e) => {
    const sortSelected = e.target.value;

    //Update the newly selected sort option
    setSortOption(sortSelected);

    //Do the sorting based on the selected sort option
    let sortedProjects = [...projects];

    if (sortSelected === 'name-asc') {
      sortedProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    } else if (sortSelected === 'name-desc') {
      sortedProjects.sort((a, b) => b.projectName.localeCompare(a.projectName));
    } else if (sortSelected === 'date-asc') {
      sortedProjects.sort((a, b) => a.start_date.localeCompare(b.start_date));
    } else if (sortSelected === 'date-desc') {
      sortedProjects.sort((a, b) => b.start_date.localeCompare(a.start_date));
    }

    //Update the projects state with the sorted projects
    setProjects(sortedProjects);
  };

  //Used to handle the form visibility
  const handleFormAction = () => {
    setShowForm(!showForm);
  };

  //Used to handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //Used to filter projects based on the search term
  const searchedProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="appContainer">
      <h1>Projects</h1>

      {/*Sorting options */}
      <div className="sortContainer">
        <label>Sort by:</label>
        <select value={sortOption} onChange={handleSort}>
          <option value="">None</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">Start Date (Earliest)</option>
          <option value="date-desc">Start Date (Latest)</option>
        </select>
      </div>

      {/*Search bar */}
      <div className="searchContainer">
        <label>Search by Project Name:</label>
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>

      {/*List of projects */}
      <ul className="projectList">
        {searchedProjects.map((project) => (
          <li key={project.projectIdentifier}>
            <div>
              <strong>Project Name:</strong>{" "}
              <span className="projectNameClass">{project.projectName}</span>
            </div>
            <div>
              <strong>Project ID:</strong>{" "}
              <span className="projectIDClass">{project.projectIdentifier}</span>
            </div>
            <div>
              <strong>Project Description:</strong>{" "}
              <span className="projectDescriptionClass">{project.description}</span>
            </div>
            <div>
              <strong>Project Dates:</strong>{" "}
              <span className="projectDatesClass">
                {new Date(project.start_date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" - "}
                {new Date(project.end_date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
            <button onClick={() => handleDelete(project.projectIdentifier)}>X</button>
          </li>
        ))}
      </ul>

      {/*Form visibility button (If showForm useState is true then Hide Form will appear as the text in the button, If it's not true then Create a New Project will appear as text in the button) */}
      <button onClick={handleFormAction}>{showForm ? 'Hide Form' : 'Create a New Project'}</button>

      {/*Form for the project */}
      {showForm && (
        <form className="projectForm" onSubmit={handleSubmit}>
          <h2>Create a New Project</h2>
          <div id="projectName">
            <label>
              Project Name:
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChangeInputs}
                required //Make it so that the input field has to be filled before submitting the form
              />
            </label>
          </div>
          <div id="projectIdentifier">
            <label>
              Project ID:
              <input
                type="text"
                name="projectIdentifier"
                value={formData.projectIdentifier}
                onChange={handleChangeInputs}
                required
              />
            </label>
          </div>
          <div id="projectDescription">
            <label>
              Project Description:
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChangeInputs}
                required
              ></textarea>
            </label>
          </div>
          <div id="startDate">
            <label>
              Start Date:
              <input
                type="datetime-local" //Used to show date and time
                name="startDate"
                value={formData.startDate}
                onChange={handleChangeInputs}
                required
              />
            </label>
          </div>
          <div id="endDate">
            <label>
              End Date:
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChangeInputs}
                required
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default ProjectManager;
