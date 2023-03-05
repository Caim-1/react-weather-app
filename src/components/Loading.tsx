import ReactLoading from 'react-loading';

export default function Loading() {
  return (
    <div className='Body'>
      <div className='loading-container'>
        <h2>Loading...</h2>
        <ReactLoading type='spin' height='30px' width='30px' />
      </div>
    </div>
  );
}
