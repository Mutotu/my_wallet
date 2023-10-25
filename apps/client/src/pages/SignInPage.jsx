import GenericForm from '../components/GenericForm';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { updateState } from "../store/user/userSlice";


const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
const baseURL = 'http://localhost:8080'

const signinFields = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
  },
  {
    name: 'accountNumber',
    label: 'AccountNumber',
    type: 'number',
  },
];
const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const signupValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    accountNumber: Yup.string().required('AccountNumber is required'),
  });

  const handleSignupSubmit = (values) => {
    fetch(`${baseURL}/auth`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
      redirect: 'follow',
    }).then((res) => {
      console.log(values)
      if (res.status === 201) {
        console.log(res.json)
        return res.json()
      }
      return "Username doesn't exist"

    })
      .then((res) => {
        dispatch(updateState(res.user));
        navigate('/');
      })
  };

  return (
    <div>
      <h1>Sign In</h1>
      <GenericForm
        initialValues={{
          username: '',
          accountNumber: '',
        }}
        validationSchema={signupValidationSchema}
        fields={signinFields}
        onSubmit={handleSignupSubmit}
      />
    </div>)
}

export default SignInPage