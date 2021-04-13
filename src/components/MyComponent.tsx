interface MyComponentProps {
  name: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
  return <div>{name}</div>;
};

export default MyComponent;
