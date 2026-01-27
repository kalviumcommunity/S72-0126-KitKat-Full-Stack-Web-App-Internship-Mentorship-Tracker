// Profile Tab Component
// Basic information, professional details, skills, and career interests

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function ProfileTab() {
  const [profileData, setProfileData] = useState({
    // Basic Information
    profilePhoto: null as File | null,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.edu',
    emailVerified: true,
    phone: '+1 (555) 123-4567',
    currentEducation: 'Bachelor of Science in Computer Science',
    graduationDate: '2025-05-15',
    
    // Professional Details
    currentRole: 'Computer Science Student',
    university: 'Stanford University',
    major: 'Computer Science',
    gpa: '3.8',
    portfolioLink: 'https://johndoe.dev',
    linkedinProfile: 'https://linkedin.com/in/johndoe',
    githubProfile: 'https://github.com/johndoe',
    
    // Skills & Expertise
    technicalSkills: ['JavaScript', 'React', 'Python', 'Node.js', 'AWS'],
    skillProficiencies: {
      'JavaScript': 'Advanced',
      'React': 'Advanced',
      'Python': 'Intermediate',
      'Node.js': 'Intermediate',
      'AWS': 'Beginner'
    },
    certifications: ['AWS Cloud Practitioner', 'React Developer Certification'],
    languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)'],
    
    // Career Interests
    preferredIndustries: ['Technology', 'Fintech', 'Healthcare'],
    preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer'],
    preferredLocations: ['San Francisco', 'New York', 'Seattle', 'Remote'],
    workPreference: 'Hybrid',
    salaryExpectation: '$80,000 - $120,000'
  });

  const [resumeVersions] = useState([
    { version: 'v3.2', uploadDate: '2024-01-20', fileName: 'John_Doe_Resume_v3.2.pdf', size: '245 KB', current: true },
    { version: 'v3.1', uploadDate: '2024-01-15', fileName: 'John_Doe_Resume_v3.1.pdf', size: '238 KB', current: false },
    { version: 'v3.0', uploadDate: '2024-01-10', fileName: 'John_Doe_Resume_v3.0.pdf', size: '241 KB', current: false }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !profileData.technicalSkills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s !== skill)
    }));
  };

  const handleArrayAdd = (field: string, value: string) => {
    if (value && !profileData[field as keyof typeof profileData].includes(value)) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof profileData] as string[]), value]
      }));
    }
  };

  const handleArrayRemove = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof profileData] as string[]).filter(item => item !== value)
    }));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or GIF. Max size 5MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfileData(prev => ({ ...prev, profilePhoto: file }));
                  }
                }}
              />
            </div>
          </div>

          {/* Name and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {profileData.emailVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Education
              </label>
              <input
                type="text"
                value={profileData.currentEducation}
                onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Graduation Date
              </label>
              <input
                type="date"
                value={profileData.graduationDate}
                onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Details */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Role/Status
              </label>
              <input
                type="text"
                value={profileData.currentRole}
                onChange={(e) => handleInputChange('currentRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University/College
              </label>
              <input
                type="text"
                value={profileData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major/Specialization
              </label>
              <input
                type="text"
                value={profileData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={profileData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                placeholder="e.g., 3.8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Upload
            </label>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => resumeInputRef.current?.click()}
              >
                Upload New Resume
              </Button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              
              {/* Resume Version History */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Version History</h4>
                {resumeVersions.map((resume, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">📄</div>
                      <div>
                        <p className="font-medium text-gray-900">{resume.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {resume.version} • {resume.uploadDate} • {resume.size}
                        </p>
                      </div>
                      {resume.current && (
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">Download</Button>
                      {!resume.current && (
                        <Button variant="outline" size="sm">Make Current</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Link
              </label>
              <input
                type="url"
                value={profileData.portfolioLink}
                onChange={(e) => handleInputChange('portfolioLink', e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profileData.linkedinProfile}
                onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Profile
              </label>
              <input
                type="url"
                value={profileData.githubProfile}
                onChange={(e) => handleInputChange('githubProfile', e.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
        <div className="space-y-6">
          {/* Technical Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.technicalSkills.map((skill, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                  <span>{skill}</span>
                  <button
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSkillAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  handleSkillAdd(input.value);
                  input.value = '';
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <div className="space-y-2">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span>{cert}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove('certifications', cert)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken
            </label>
            <div className="space-y-2">
              {profileData.languages.map((language, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span>{language}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove('languages', language)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Interests */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Interests</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Preference
              </label>
              <select
                value={profileData.workPreference}
                onChange={(e) => handleInputChange('workPreference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Expectations
              </label>
              <input
                type="text"
                value={profileData.salaryExpectation}
                onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                placeholder="e.g., $80,000 - $120,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}