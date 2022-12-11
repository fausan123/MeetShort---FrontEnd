import React, { useState } from 'react';
import './css/upload.css'


function Upload(props) {
  const setVisible=props.setVisible;
  const visible=props.visible;

  const [file, setFile] = useState();
  const [numspeakers, setNumspeakers] = useState(0);
  const [error, setError] = useState(null);
  const setSummary=props.setSummary;

  const changeHandler = (event) => {
    setFile(event.target.files[0]);
	};

  const submitAudio = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('num_speakers', numspeakers);
    
    const options = { 
      method: 'post',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    }

    fetch(`${process.env.REACT_APP_API_URL}/summariser/getsummary/`, options)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then(text => {throw text})
      }
    }).then(d => {
      setVisible(false)
      alert(`Summary Generated !!`)
      document.getElementById('displaySummary').scrollIntoView({ behavior: 'smooth' });
      setError(null)
      setSummary(d.transcript)
    }).catch(err => {
        console.log(err)
        if (err.Error === "RuntimeError") {
          setError('Audio file is of invalid format !!')
        } else if (err.Message) {
          setError(err.Message);
        } else {
          setError('Please try submitting audio again...');
        }
    })
  }

    

  return (
      <div className='upload'>
        <h2>Upload Your File</h2>
        <img src={require('../assets/removed.png')} alt='bg' />
        

        <input className='input' type="file" name="file" accept="audio/wav" onChange={changeHandler}/><label className='spkrinput'>
         Number of Speakers :
          <input size={1} type="text" name="numspeakers" onChange={(e) => setNumspeakers(e.target.value)}/>
        </label>

        <button className='upbtn' type="button" onClick={submitAudio}>Submit</button>
        {error && <p className='error'>{ error }</p>}
        <button onClick={() => setVisible(!visible)} className='close'>Close</button>
      </div>

// https://bosctechlabs.com/scroll-to-an-element-in-react/#Scroll_to_an_Element_With_the_React_Refs_References



  )
}

export default Upload