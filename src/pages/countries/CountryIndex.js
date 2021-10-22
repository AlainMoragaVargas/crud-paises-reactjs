import React,{useEffect,useState} from 'react';

const CountryIndex = () => {

  /* se inicializan estados en react para formulario y listado */
  const [country,setCountry] = useState([]);
  const [form,setForm] = useState({
    countryName : '',
    countryPrefix : '',
    countryDomain : '',
    countryFlag : '',
    formType : 'Guardar',
    countryId : ''
  }); 

  /* función que vuelve el estado del formulario al inicial */
  const resetFormState = () => {
    setForm({
      countryName : '',
      countryPrefix : '',
      countryDomain : '',
      countryFlag : '',
      formType : 'Guardar',
      countryId : ''
    });
  }

  /* función que va actualizando el estado de los inputs del formulario */
  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value
    });
  };

  /* función que obtiene todos los paises mediante una petición a una api */
  const getCountries = async () => {
    const data = await fetch(`http://127.0.0.1:8000/api/countries/list`);
    const countries = await data.json();
    setCountry(countries); 
  }

  /* función que elimina un pais mediante una petición a una api */
  const deleteContries = async (id) => {
    const data = await fetch(`http://127.0.0.1:8000/api/countries/delete-country/${id}`);
    const response = await data.json();
    response.success === true ? alert(response.message) : alert('Ha ocurrido un error.');
    resetFormState();
    getCountries();
  }

  /* 
    función que inserta o actualiza un pais mediante una petición a una api,
    dependiendo de un estado en particular. 
  */
  const insertUpdateCountry = async (e) => {
    e.preventDefault();
    if(form.formType === 'Editar')
    {
      const data = await fetch('http://127.0.0.1:8000/api/countries/update-country',{
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await data.json();
      response.success === true ? alert(response.message) : alert('Ha ocurrido un error.');
      resetFormState();
    }
    else
    {
      const data = await fetch('http://127.0.0.1:8000/api/countries/create-country',{
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await data.json();
      response.success === true ? alert(response.message) : alert('Ha ocurrido un error.');
      resetFormState();
    }
    getCountries();
  };

  /* función que obtiene el pais a editar mediante una petición a una api */
  const editCountry = async (id) => {
    const data = await fetch(`http://127.0.0.1:8000/api/countries/edit-country/${id}`);
    const response = await data.json();
    setForm({
      countryName : response.country_name,
      countryPrefix : response.country_prefix,
      countryDomain : response.country_domain,
      countryFlag : response.country_flag,
      formType : 'Editar',
      countryId : id
    });
  }

  /* hook de react para obtener todos los paises al renderizar el componente */
  useEffect(() => {
    getCountries();
  },[]);

  return (
  <div className='country-container'>
    <div className="row">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre País</th>
            <th>Prefijo País</th>
            <th>Dominio País</th>
            <th>Bandera País</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            country.map( item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.country_name}</td>
                <td>{item.country_prefix}</td>
                <td>{item.country_domain}</td>
                <td>{item.country_flag}</td>
                <td>
                  <button onClick={(e) => editCountry(item.id, e)} > Modificar </button>
                  <button onClick={(e) => deleteContries(item.id, e)} >Eliminar</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    <div className="row">
      <form onSubmit={insertUpdateCountry}>
        <div>
          <input 
            type="text"
            name="countryName" 
            onChange={handleInputChange}
            placeholder="Nombre del País"
            value={form.countryName}
          />
        </div>
        <div>
          <input 
            type="text"
            name="countryPrefix" 
            onChange={handleInputChange}
            placeholder="Prefijo del País" 
            value={form.countryPrefix}
          />
        </div>
        <div>
          <input 
            type="text"
            name="countryDomain" 
            onChange={handleInputChange}
            placeholder="Dominio del País" 
            value={form.countryDomain}
          />
        </div>
        <div>
          <input 
            type="text"
            name="countryFlag" 
            onChange={handleInputChange}
            placeholder="Bandera del País" 
            value={form.countryFlag}
          />
        </div>
        <div>
          <button type="submit">{form.formType}</button>
        </div>
      </form>
    </div>
  </div>
  )  
}

export default CountryIndex;