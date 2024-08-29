'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  shortDescription: string;
  foundedOn: string;
  fundingTotal: string;
  lastFundingType: string;
  numEmployeesEnum: string;
  website: string;
  contactEmail: string;
  phoneNumber: string;
  linkedin: string;
  twitter: string;
}

async function getCompany(id: string): Promise<Company> {
  const res = await fetch(`/api/company?id=${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch company');
  }
  return res.json();
}

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const data = await getCompany(id as string);
        setCompany(data);
      } catch (err) {
        setError('Failed to load company details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-4">Back to Companies</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Company Details</h2>
          <p><strong>Description:</strong> {company.shortDescription}</p>
          <p><strong>Founded:</strong> {company.foundedOn}</p>
          <p><strong>Funding Total:</strong> {company.fundingTotal}</p>
          <p><strong>Last Funding Type:</strong> {company.lastFundingType}</p>
          <p><strong>Employees:</strong> {company.numEmployeesEnum}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
          <p><strong>Email:</strong> {company.contactEmail}</p>
          <p><strong>Phone:</strong> {company.phoneNumber}</p>
          <p><strong>LinkedIn:</strong> <a href={company.linkedin} target="_blank" rel="noopener noreferrer">{company.linkedin}</a></p>
          <p><strong>Twitter:</strong> <a href={company.twitter} target="_blank" rel="noopener noreferrer">{company.twitter}</a></p>
        </div>
      </div>
    </div>
  );
}
