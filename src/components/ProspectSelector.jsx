import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '../integrations/supabase/supabase';

const ProspectSelector = ({ onSelectProspects }) => {
  const [prospects, setProspects] = useState([]);
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      const { data, error } = await supabase.from('contacts').select('*');
      if (error) throw error;
      setProspects(data);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    }
  };

  const handleSearch = () => {
    const filtered = prospects.filter(prospect =>
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProspects(filtered);
  };

  const handleSelectProspect = (prospectId) => {
    setSelectedProspects(prev =>
      prev.includes(prospectId)
        ? prev.filter(id => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  const handleConfirmSelection = () => {
    onSelectProspects(selectedProspects);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search prospects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="space-y-2">
        {prospects.map(prospect => (
          <div key={prospect.id} className="flex items-center space-x-2">
            <Checkbox
              id={`prospect-${prospect.id}`}
              checked={selectedProspects.includes(prospect.id)}
              onCheckedChange={() => handleSelectProspect(prospect.id)}
            />
            <label htmlFor={`prospect-${prospect.id}`}>{prospect.name} ({prospect.email})</label>
          </div>
        ))}
      </div>
      <Button onClick={handleConfirmSelection}>Confirm Selection</Button>
    </div>
  );
};

export default ProspectSelector;