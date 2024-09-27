import { useState, useEffect } from 'react';

const useGoogleAutocomplete = (inputRef) => {
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (inputRef.current && !autocomplete) {
      const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current);
      setAutocomplete(autocompleteInstance);
    }
  }, [inputRef, autocomplete]);

  return autocomplete;
};

export default useGoogleAutocomplete;
