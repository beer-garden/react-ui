
const Search = ({self}) => {
  const [checked, setChecked] = React.useState(self.state.include_children);

  const handleChange = (event) => {
    let state = self.state;
    setChecked(event.target.checked);
    state.include_children = !state.include_children;
    state.page = 0;
    RequestService.dataFetch(self, state.rowsPerPage, 0*self.state.rowsPerPage, state.include_children);
  };

  return (
    <div>
      <Checkbox
        checked={checked}
        onChange={handleChange}
      />Include Children
    </div>
  );
}

export default Search