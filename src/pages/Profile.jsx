import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const Profile = () => {
  const { session, updateProfile } = useSupabaseAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    emailProvider: '',
    emailApiKey: '',
    emailDomain: '',
  });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile({
        name: data.name || '',
        email: data.email || session.user.email,
        phone: data.phone || '',
        emailProvider: data.email_provider || '',
        emailApiKey: data.email_api_key || '',
        emailDomain: data.email_domain || '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          name: profile.name,
          phone: profile.phone,
          email_provider: profile.emailProvider,
          email_api_key: profile.emailApiKey,
          email_domain: profile.emailDomain,
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select
                name="emailProvider"
                value={profile.emailProvider}
                onValueChange={(value) => handleChange({ target: { name: 'emailProvider', value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emailApiKey">Email API Key</Label>
              <Input
                id="emailApiKey"
                name="emailApiKey"
                type="password"
                value={profile.emailApiKey}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="emailDomain">Email Domain</Label>
              <Input
                id="emailDomain"
                name="emailDomain"
                value={profile.emailDomain}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
