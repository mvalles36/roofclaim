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
    role: faker.random.arrayElement(['admin', 'sales', 'manager', 'support', 'supplement_specialist', 'roofing_crew_lead']),
  }));

  const { data: createdUsers, error: userError } = await supabase.from('users').insert(users);
  if (userError) console.error('Error seeding users:', userError);

  // Seed customers
  const customers = Array.from({ length: 50 }, () => ({
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    customer_type: faker.random.arrayElement(['residential', 'commercial']),
  }));

  const { data: createdCustomers, error: customerError } = await supabase.from('customers').insert(customers);
  if (customerError) console.error('Error seeding customers:', customerError);

  // Seed jobs
  const jobs = Array.from({ length: 30 }, () => ({
    customer_id: faker.random.arrayElement(createdCustomers).id,
    job_type: faker.random.arrayElement(['roof repair', 'roof replacement', 'inspection']),
    roof_type: faker.random.arrayElement(['shingle', 'metal', 'tile', 'flat']),
    job_status: faker.random.arrayElement(['pending', 'in progress', 'completed']),
    job_cost_estimate: faker.datatype.number({ min: 1000, max: 20000 }),
    start_date: faker.date.past(),
    end_date: faker.date.future(),
    assigned_crew: faker.name.findName(),
    job_notes: faker.lorem.paragraph(),
  }));

  const { data: createdJobs, error: jobError } = await supabase.from('jobs').insert(jobs);
  if (jobError) console.error('Error seeding jobs:', jobError);

  // Seed invoices
  const invoices = createdJobs.map(job => ({
    customer_id: job.customer_id,
    job_id: job.id,
    amount_due: job.job_cost_estimate,
    payment_status: faker.random.arrayElement(['unpaid', 'partially paid', 'paid']),
    invoice_date: job.start_date,
    payment_due_date: faker.date.future(),
    payment_method: faker.random.arrayElement(['credit card', 'check', 'cash']),
  }));

  const { error: invoiceError } = await supabase.from('invoices').insert(invoices);
  if (invoiceError) console.error('Error seeding invoices:', invoiceError);

  // Seed supplements
  const supplements = Array.from({ length: 20 }, () => ({
    claim_number: faker.datatype.uuid(),
    status: faker.random.arrayElement(['pending', 'approved', 'denied']),
    amount: faker.datatype.number({ min: 500, max: 5000 }),
    created_at: faker.date.past(),
    job_id: faker.random.arrayElement(createdJobs).id,
  }));

  const { error: supplementError } = await supabase.from('supplements').insert(supplements);
  if (supplementError) console.error('Error seeding supplements:', supplementError);

  console.log('Database seeding completed.');
};

seedDatabase().catch(console.error);