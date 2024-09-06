import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `
      Create a professional resume and cover letter for:
      Name: ${name}
      Job Title: ${jobTitle}
      Skills: ${skills}
      Experience: ${experience}
    `;

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });

      const generatedText = response.data.choices[0].text;
      const [generatedResume, generatedCoverLetter] = generatedText.split('Cover Letter:');
      setResume(generatedResume.trim());
      setCoverLetter(generatedCoverLetter.trim());
    } catch (error) {
      console.error("Error generating resume/cover letter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Resume and Cover Letter Generator</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Job Title" 
          value={jobTitle} 
          onChange={(e) => setJobTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Skills (comma-separated)" 
          value={skills} 
          onChange={(e) => setSkills(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Experience (short summary)" 
          value={experience} 
          onChange={(e) => setExperience(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Resume & Cover Letter'}
        </button>
      </form>
      <div className="output">
        {resume && (
          <div>
            <h2>Generated Resume</h2>
            <pre>{resume}</pre>
          </div>
        )}
        {coverLetter && (
          <div>
            <h2>Generated Cover Letter</h2>
            <pre>{coverLetter}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
