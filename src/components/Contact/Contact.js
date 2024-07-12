import axios from 'axios';

const Contact   = () => {
const options = {
  method: 'GET',
  url: 'https://api.brevo.com/v3/contacts/lists/5',
  headers: {
    accept: 'application/json',
    'api-key': process.env.REACT_APP_BREVO_API_KEY
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

return (
  <ul>
            <li key={Contact.id}>
              {Contact.id} - {Contact.email} -  {Contact.attributes.Catégorie}
            </li>
        </ul>
);
}
  export default Contact;