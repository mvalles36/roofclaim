import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchPropertiesInBounds } from '../services/melissaDataService';
import { saveList } from '../services/listService';
import ProspectMap from '../components/prospects/ProspectMap';
import SaveListDialog from '../components/prospects/SaveListDialog';

const FindProspects = ({ companyId, onListCreated }) => {
  const [properties, setProperties] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const { toast } = useToast();

  const handleAreaSelected = async (boundaryPoints) => {
    try {
      setLoading(true);
      const fetchedProperties = await fetchPropertiesInBounds(boundaryPoints);
      
      if (fetchedProperties.length === 0) {
        toast({
          title: "No properties found",
          description: "No properties were found in the selected area. Try selecting a different area.",
          variant: "warning",
        });
        return;
      }

      setProperties(fetchedProperties);
      setShowSaveDialog(true);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveList = async () => {
    if (!listName) return;

    try {
      setLoading(true);
      const listData = {
        companyId,
        name: listName,
        properties
      };

      await saveList(listData);
      
      toast({
        title: "Success",
        description: `List "${listName}" has been saved and sent to Suppose.`,
      });
      
      setShowSaveDialog(false);
      setListName('');
      
      if (onListCreated) {
        onListCreated(listData);
      }
    } catch (error) {
      console.error('Error saving list:', error);
      toast({
        title: "Error",
        description: "Failed to save list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Selector</CardTitle>
        </CardHeader>
        <CardContent>
          <ProspectMap
            onAreaSelected={handleAreaSelected}
            address={address}
            setAddress={setAddress}
          />
        </CardContent>
      </Card>

      <SaveListDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        listName={listName}
        setListName={setListName}
        onSave={handleSaveList}
        propertiesCount={properties.length}
        loading={loading}
      />
    </div>
  );
};

export default FindProspects;