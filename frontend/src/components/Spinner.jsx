const Spinner = () => {
  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <div role='status' className='spinner-border text-primary'>
        <span className='visually-hidden'>Загрузка...</span>
      </div>
    </div>
  );
};

export default Spinner;
