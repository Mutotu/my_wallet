import GenericForm from '../components/GenericForm';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
const baseURL = 'http://localhost:8080'
const signupFields = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
  },
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
  },
];

const SignUpPage = () => {
  const navigate = useNavigate();


  const signupValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    fullName: Yup.string().required('Full Name is required'),
  });

  const handleSignupSubmit = (values) => {
    fetch(`${baseURL}/user`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: values.username, fullName: values.fullName }),
      redirect: 'follow',
    }).then((res) => {
      if (res.status === 201) {
        return res.json()
      } else if (res.status === 300) {
        return "Username exists"
      }
    })
      .then((r) => {
        console.log(r)
        navigate('/signin');
      })
  };

  return (
    <div>
      <h1>Signup</h1>
      <GenericForm
        initialValues={{
          username: '',
          fullName: '',
        }}
        validationSchema={signupValidationSchema}
        fields={signupFields}
        onSubmit={handleSignupSubmit}
      />
      <button onClick={() => navigate("/signin")}>Have an account</button>
    </div>
  );

}


export default SignUpPage