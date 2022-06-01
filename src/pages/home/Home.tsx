import Search from '../question/search/Search';

function Home(props) {
  return (
    <div>
      <Search user={props.user} />
    </div >
  );
}

export default Home;
