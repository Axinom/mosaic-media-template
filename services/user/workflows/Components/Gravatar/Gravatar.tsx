import React, { useEffect, useState } from 'react';

/**
 * Gravatar component to display a user's Gravatar image based on their email address.
 *
 * @param {string} email - The user's email address.
 * @param {number} size - The size of the Gravatar image (default is 80).
 * @returns {JSX.Element|null} - A div containing the Gravatar image or null if the URL is not generated yet.
 */
export const Gravatar: React.FC<{
  email: string;
  size?: number;
}> = ({ email, size = 80 }) => {
  const [gravatarUrl, setGravatarUrl] = useState<string>('');

  useEffect(() => {
    const getGravatarUrl = async (email: string): Promise<void> => {
      try {
        // Convert email to lowercase and trim
        const normalizedEmail = email.trim().toLowerCase();

        // Use SubtleCrypto to calculate SHA-256 hash
        const msgBuffer = new TextEncoder().encode(normalizedEmail);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // Convert hash to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        const url = `https://www.gravatar.com/avatar/${hashHex}?s=${size}&d=mp`;
        setGravatarUrl(url);
      } catch (error) {
        console.error('Error generating Gravatar URL:', error);
      }
    };

    getGravatarUrl(email ?? '');
  }, [email, size]);

  return gravatarUrl ? (
    <div style={{ textAlign: 'center' }}>
      <img
        src={gravatarUrl}
        alt="User Gravatar"
        style={{ borderRadius: '50%', width: `${size}px`, height: `${size}px` }}
      />
    </div>
  ) : null;
};
