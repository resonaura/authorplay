import { useNavigate } from 'react-router-dom';
import SmoothBackgroundImage from '../../components/smoothBackgroundImage';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <SmoothBackgroundImage
        src='assets/images/bg-9.jpeg'
        className='bg-wrapper'
      ></SmoothBackgroundImage>
      <div className='about-content-wrapper'>
        <div className='about-content'>
          <img
            width={64}
            height={64}
            src='/assets/images/authorplay-inverted.svg'
          />
          <p>Welcome to the beta version of our project</p>
          <p>
            For all questions be free to contact us
            <br />
            using this E-Mail:{' '}
            <a href='mailto:resonaura@gmail.com'>resonaura@gmail.com</a>
          </p>

          <button onClick={() => navigate('/online')} className='online'>
            Listen online
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
