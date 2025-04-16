import axios from 'axios';

axios.get('https://jsonplaceholder.typicode.com')
.then(function(response){
    console.log(response.data)
})
