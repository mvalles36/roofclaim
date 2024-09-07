import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Roofing Co.</h1>
      <p className="text-xl mb-8">We help residential homeowners with storm damage insurance claims and roof replacements.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/inspections">Schedule Inspection</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/claims">Manage Claims</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;