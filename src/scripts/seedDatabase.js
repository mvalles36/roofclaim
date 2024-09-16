const { createClient } = require('@supabase/supabase-js');
const faker = require('faker');

const supabaseUrl = process.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and API key must be set in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedDatabase = async () => {
  console.log('Seeding database...');

  // Seed users
  const users = Array.from({ length: 10 }, () => ({
    email: faker.internet.email(),
    name: faker.name.findName(),
    role: faker.random.arrayElement([
      'admin', 'sales', 'manager', 'support', 
      'supplement_specialist', 'roofing_crew_lead'
    ]),
  }));

  const { data: createdUsers, error: userError } = await supabase.from('users').insert(users);
  if (userError) console.error('Error seeding users:', userError);

  // Seed contacts (customers or prospects)
  const contacts = Array.from({ length: 50 }, () => ({
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    income: `$${faker.datatype.number({ min: 20000, max: 150000 }).toLocaleString('en-US')}`,
    contact_type: faker.random.arrayElement(['Lead', 'Prospect', 'Customer', 'VIP']),
  }));

  const { data: createdContacts, error: contactsError } = await supabase.from('contacts').insert(contacts);
  if (contactsError) console.error('Error seeding contacts:', contactsError);

  // Seed jobs (post-sales, after installation project is created)
  const jobs = Array.from({ length: 30 }, () => ({
    customer_id: faker.random.arrayElement(createdContacts).id,
    job_type: faker.random.arrayElement([
      'Roof Repair', 'Roof Replacement', 'Inspection', 
      'Maintenance Plan', 'Manufacturer Warranty'
    ]),
    roof_type: faker.random.arrayElement([
      '3-Tab Shingle', 'Architectural Shingle', 'Composition Shingle', 
      'Asphalt Shingle', 'Tile', 'Flat', 'Metal'
    ]),
    job_status: faker.random.arrayElement([
      'Job Created', 'Materials Ordered', 'Materials Delivered', 'Scheduling Installation',
      'Installation Scheduled', 'In Progress', 'Installation Paused', 
      'Installation Completed', 'Final Inspection', 'Touch-Ups Needed',
      'Job Completed', 'Customer Sign-Off', 'Warranty Follow-Up'
    ]),
    job_cost_estimate: faker.datatype.number({ min: 1000, max: 20000 }),
    start_date: faker.date.past(),
    end_date: faker.date.future(),
    assigned_crew: faker.company.companyName(),
    job_notes: faker.lorem.paragraph(),
  }));

  const { data: createdJobs, error: jobError } = await supabase.from('jobs').insert(jobs);
  if (jobError) console.error('Error seeding jobs:', jobError);

  // Seed invoices (after job is completed)
  const invoices = createdJobs.map(job => ({
    customer_id: job.customer_id,
    job_id: job.id,
    amount_due: job.job_cost_estimate,
    payment_status: faker.random.arrayElement(['Unpaid', 'Partial Payment', 'Paid', 'Overdue']),
    invoice_date: job.start_date,
    payment_due_date: faker.date.future(),
    payment_method: faker.random.arrayElement(['Credit Card', 'Check', 'Cash', 'ACH']),
  }));

  const { error: invoiceError } = await supabase.from('invoices').insert(invoices);
  if (invoiceError) console.error('Error seeding invoices:', invoiceError);

  // Seed supplements (related to jobs, like damage reports or re-inspections)
  const supplements = Array.from({ length: 20 }, () => ({
    claim_number: faker.finance.account(), 
    status: faker.random.arrayElement([
      'Untouched', 'Awaiting Decision', 'Re-Inspection', 
      'Additional Info Needed', 'Approved', 'Denied'
    ]),
    amount: `$${faker.datatype.number({ min: 500, max: 15000 }).toLocaleString('en-US')}`,
    created_at: faker.date.past(),
    job_id: faker.random.arrayElement(createdJobs).id,
  }));

  const { error: supplementError } = await supabase.from('supplements').insert(supplements);
  if (supplementError) console.error('Error seeding supplements:', supplementError);

  console.log('Database seeding completed.');
};

seedDatabase().catch(console.error);
