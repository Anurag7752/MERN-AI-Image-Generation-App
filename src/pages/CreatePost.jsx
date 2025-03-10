import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';
import { preview } from '../assets';
function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingTag, setGeneratingTag] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (!form.prompt) {
      alert('Please enter a prompt!');
      return;
    }
    setGeneratingTag(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: form.prompt }),
      })


      if (response.ok) {
        const data = await response.json();
        setForm({ ...form, photo: data.photo });
      } else {
        alert('Failed to generate the image.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Something went wrong.');
    } finally {
      setGeneratingTag(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.photo || !form.name || !form.prompt) {
      alert('Please complete the form and generate an image.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('Post shared successfully!');
        navigate('/');
      } else {
        alert('Failed to share the post.');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
    <div>
      <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
      <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
    </div>

    <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5">
        <FormField
          labelName="Your Name"
          type="text"
          name="name"
          placeholder="Anurag kumar"
          value={form.name}
          handleChange={handleChange}
        />

        <FormField
          labelName="Prompt"
          type="text"
          name="prompt"
          placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
          value={form.prompt}
          handleChange={handleChange}
          isSurpriseMe
          handleSurpriseMe={handleSurpriseMe}
        />

        <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
          { form.photo ? (
            <img
              src={form.photo}
              alt={form.prompt}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="w-9/12 h-9/12 object-contain opacity-40"
            />
          )}

          {generatingTag && (
            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-5">
        <button
          type="button"
          onClick={generateImage}
          className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {generatingTag ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="mt-10">
        <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
        <button
          type="submit"
          className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {loading ? 'Sharing...' : 'Share with the Community'}
        </button>
      </div>
    </form>
  </section>
  );
}

export default CreatePost;
