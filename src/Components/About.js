import React from 'react'

const About = () => {
  return (
    <div className="container my-4">
      <h2>About iNotebook</h2>

      <p className="lead">
        iNotebook is a simple and secure note-taking application designed to
        help you create, manage, edit, and organize your notes in one place.
      </p>

      <h4>What can you do with iNotebook?</h4>

      <ul>
        <li>Create and save your personal notes.</li>
        <li>Edit your notes whenever you need.</li>
        <li>Delete notes that are no longer required.</li>
        <li>Securely manage your notes using user authentication.</li>
        <li>Access your notes through a clean and easy-to-use interface.</li>
      </ul>

      <h4>Technology Used</h4>

      <p>
        iNotebook is built using React for the frontend and Node.js,
        Express.js, and MongoDB for the backend and database.
      </p>
    </div>
  )
}

export default About