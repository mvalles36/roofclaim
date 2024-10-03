import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from './path-to-your-nav-menu-file'; // Adjust path as necessary

const Navigation = () => {
  const { signOut } = useSupabaseAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.label !== 'Log Out' ? (
              <NavigationMenuLink to={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </NavigationMenuLink>
            ) : (
              <Button onClick={signOut} variant="outline">
                Log Out
              </Button>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
