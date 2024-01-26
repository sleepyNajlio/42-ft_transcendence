import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className='Config'>
      <h1 style={styles.heading}>404 - Not Found</h1>
      <p style={styles.text}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/Profile" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(65.87deg, #173256 20.93%, #0F597B 92.75%)',
    color: '#fff', // Set text color to white for better visibility on the gradient background
  },
  heading: {
    fontSize: '2em',
    margin: '0',
    color: 'white',
  },
  text: {
    fontSize: '1em',
    color: 'white',
    marginBottom: '20px',
  },
  link: {
    fontSize: '1.2em',
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default NotFound;
