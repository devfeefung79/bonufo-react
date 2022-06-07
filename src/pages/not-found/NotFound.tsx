import EmptyItemBox from '../component/empty-item-box/EmptyItemBox';

function NotFound() {
  return (
    <EmptyItemBox description={`Page Not Found. Please check if your URL is correct!`} />
  );
}

export default NotFound;
