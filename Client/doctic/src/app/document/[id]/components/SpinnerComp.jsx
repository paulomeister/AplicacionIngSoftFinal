import Spinner from 'react-bootstrap/Spinner';

export function SpinerComp() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
      <Spinner animation="border" role="status" style={{ width: '6rem', height: '6rem' }} >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}