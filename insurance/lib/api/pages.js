import { API_BASE_URL } from '@/lib/config';

// Get static page by type
export async function getStaticPage(pageType) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages/${pageType}/`, {
      method: 'GET',
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching static page:', error);
    throw error;
  }
}

// Get all static pages
export async function getAllStaticPages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching static pages:', error);
    throw error;
  }
}

// Get team members
export async function getTeamMembers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/team/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
}

// Get company info
export async function getCompanyInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch company info: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Be resilient during server-side metadata generation; return null instead of throwing
    console.warn('Company info fetch failed; using defaults:', error?.message || error);
    return null;
  }
}

// Submit contact form
export async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to submit form: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

// Get Car Insurance Quotes page structured content
export async function getCarInsuranceQuotesPage() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/car-insurance-quotes/`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quotes page: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Car Insurance Quotes page:', error);
    throw error;
  }
}