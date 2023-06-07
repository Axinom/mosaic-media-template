import { v4 as uuid } from 'uuid';
import { create } from 'xmlbuilder2';
import { convertObjectToXml } from '../../common';
import {
  createDashCpixRequest,
  createDecryptionCpixRequest,
  createHlsCpixRequest,
  DRMKey,
} from './utils';

describe('utils', () => {
  describe('createDashCpixRequest', () => {
    const contentId = uuid();
    const singleKeyRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8"?>
      <cpix:CPIX xmlns:cpix="urn:dashif:org:cpix" xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc" contentId="${contentId}" version="2.3">
        <cpix:ContentKeyList>
          <cpix:ContentKey kid="55189816-6add-4358-8e22-3fce44f5c565" commonEncryptionScheme="cenc" />
        </cpix:ContentKeyList>
        <cpix:DRMSystemList>
          <cpix:DRMSystem kid="55189816-6add-4358-8e22-3fce44f5c565" systemId="9a04f079-9840-4286-ab92-e65be0885f95">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:SmoothStreamingProtectionHeaderData />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="55189816-6add-4358-8e22-3fce44f5c565" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
          </cpix:DRMSystem>
        </cpix:DRMSystemList>
        <cpix:ContentKeyUsageRuleList>
          <cpix:ContentKeyUsageRule kid="55189816-6add-4358-8e22-3fce44f5c565">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="55189816-6add-4358-8e22-3fce44f5c565">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
        </cpix:ContentKeyUsageRuleList>
      </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });

    const multipleKeysRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8"?>
      <cpix:CPIX xmlns:cpix="urn:dashif:org:cpix" xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc" contentId="${contentId}" version="2.3">
        <cpix:ContentKeyList>
          <cpix:ContentKey kid="55189816-6add-4358-8e22-3fce44f5c565" commonEncryptionScheme="cenc" />
          <cpix:ContentKey kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" commonEncryptionScheme="cenc" />
        </cpix:ContentKeyList>
        <cpix:DRMSystemList>
          <cpix:DRMSystem kid="55189816-6add-4358-8e22-3fce44f5c565" systemId="9a04f079-9840-4286-ab92-e65be0885f95">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:SmoothStreamingProtectionHeaderData />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="55189816-6add-4358-8e22-3fce44f5c565" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" systemId="9a04f079-9840-4286-ab92-e65be0885f95">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:SmoothStreamingProtectionHeaderData />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
          </cpix:DRMSystem>
        </cpix:DRMSystemList>
        <cpix:ContentKeyUsageRuleList>
          <cpix:ContentKeyUsageRule kid="55189816-6add-4358-8e22-3fce44f5c565">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="55189816-6add-4358-8e22-3fce44f5c565">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
        </cpix:ContentKeyUsageRuleList>
      </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });

    it('request is generated, if drm keys list has one key', () => {
      // Arrange
      const drmKeys: string[] = ['55189816-6add-4358-8e22-3fce44f5c565'];

      // Act
      const cpixRequest = createDashCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(singleKeyRequest);
    });

    it('request is generated, if drm keys list has multiple keys', () => {
      // Arrange
      const drmKeys: string[] = [
        '55189816-6add-4358-8e22-3fce44f5c565',
        '5147f1a6-2fe7-402a-9c14-05cfeb82fdbe',
      ];

      // Act
      const cpixRequest = createDashCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(
        multipleKeysRequest,
      );
    });
  });

  describe('createDecryptionCpixRequest', () => {
    const contentId = uuid();
    const singleKeyRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8"?>
    <cpix:CPIX contentId="${contentId}" version="2.3" xmlns:cpix="urn:dashif:org:cpix" xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:enc="http://www.w3.org/2001/04/xmlenc#">
      <cpix:ContentKeyList>
        <cpix:ContentKey kid="538db30e-23da-4f29-9c72-406d10227e58" commonEncryptionScheme="cbcs" />
      </cpix:ContentKeyList>
      <cpix:DRMSystemList>
        <cpix:DRMSystem kid="538db30e-23da-4f29-9c72-406d10227e58" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
          <cpix:PSSH />
          <cpix:ContentProtectionData />
          <cpix:HLSSignalingData playlist="media" />
          <cpix:HLSSignalingData playlist="master" />
        </cpix:DRMSystem>
      </cpix:DRMSystemList>
      <cpix:ContentKeyUsageRuleList>
        <cpix:ContentKeyUsageRule kid="538db30e-23da-4f29-9c72-406d10227e58" intendedTrackType="VIDEO">
          <cpix:VideoFilter />
        </cpix:ContentKeyUsageRule>
        <cpix:ContentKeyUsageRule kid="538db30e-23da-4f29-9c72-406d10227e58" intendedTrackType="AUDIO">
          <cpix:AudioFilter />
        </cpix:ContentKeyUsageRule>
      </cpix:ContentKeyUsageRuleList>
    </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });

    const multipleKeysRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8" ?>
      <cpix:CPIX contentId="${contentId}" version="2.3"
        xmlns:cpix="urn:dashif:org:cpix"
        xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc"
        xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
        xmlns:enc="http://www.w3.org/2001/04/xmlenc#">
        <cpix:ContentKeyList>
          <cpix:ContentKey kid="de984e5f-8a58-4cae-88e5-f6831ab40e07" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="0f055cb8-303e-45a8-9c41-ca2a85d78a86" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="7821f4d4-30da-45b5-a9db-292aee8b93e4" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="87cb034e-ba3a-48b5-b805-c8ee5f96ac4c" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="9efaa339-6008-42a3-9d29-3fe0e0cdeb8e" commonEncryptionScheme="cbcs" />
        </cpix:ContentKeyList>
        <cpix:DRMSystemList>
          <cpix:DRMSystem kid="de984e5f-8a58-4cae-88e5-f6831ab40e07" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="0f055cb8-303e-45a8-9c41-ca2a85d78a86" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="7821f4d4-30da-45b5-a9db-292aee8b93e4" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="87cb034e-ba3a-48b5-b805-c8ee5f96ac4c" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="9efaa339-6008-42a3-9d29-3fe0e0cdeb8e" systemId="edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
            <cpix:PSSH />
            <cpix:ContentProtectionData />
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
        </cpix:DRMSystemList>
        <cpix:ContentKeyUsageRuleList>
          <cpix:ContentKeyUsageRule kid="de984e5f-8a58-4cae-88e5-f6831ab40e07" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="de984e5f-8a58-4cae-88e5-f6831ab40e07" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="0f055cb8-303e-45a8-9c41-ca2a85d78a86" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="0f055cb8-303e-45a8-9c41-ca2a85d78a86" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="7821f4d4-30da-45b5-a9db-292aee8b93e4" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="7821f4d4-30da-45b5-a9db-292aee8b93e4" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="87cb034e-ba3a-48b5-b805-c8ee5f96ac4c" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="87cb034e-ba3a-48b5-b805-c8ee5f96ac4c" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="9efaa339-6008-42a3-9d29-3fe0e0cdeb8e" intendedTrackType="VIDEO">
            <cpix:VideoFilter />
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="9efaa339-6008-42a3-9d29-3fe0e0cdeb8e" intendedTrackType="AUDIO">
            <cpix:AudioFilter />
          </cpix:ContentKeyUsageRule>
        </cpix:ContentKeyUsageRuleList>
      </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });

    it('request is generated, if drm keys list has one key', () => {
      // Arrange
      const drmKeys: DRMKey[] = [
        { keyId: '538db30e-23da-4f29-9c72-406d10227e58', keyType: 'VIDEO' },
        { keyId: '538db30e-23da-4f29-9c72-406d10227e58', keyType: 'AUDIO' },
      ];

      // Act
      const cpixRequest = createDecryptionCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(singleKeyRequest);
    });

    it('request is generated, if drm keys list has multiple keys', () => {
      // Arrange
      const drmKeys: DRMKey[] = [
        { keyId: 'de984e5f-8a58-4cae-88e5-f6831ab40e07', keyType: 'VIDEO' },
        { keyId: 'de984e5f-8a58-4cae-88e5-f6831ab40e07', keyType: 'AUDIO' },

        { keyId: '0f055cb8-303e-45a8-9c41-ca2a85d78a86', keyType: 'VIDEO' },
        { keyId: '0f055cb8-303e-45a8-9c41-ca2a85d78a86', keyType: 'AUDIO' },

        { keyId: '7821f4d4-30da-45b5-a9db-292aee8b93e4', keyType: 'VIDEO' },
        { keyId: '7821f4d4-30da-45b5-a9db-292aee8b93e4', keyType: 'AUDIO' },

        { keyId: '87cb034e-ba3a-48b5-b805-c8ee5f96ac4c', keyType: 'VIDEO' },
        { keyId: '87cb034e-ba3a-48b5-b805-c8ee5f96ac4c', keyType: 'AUDIO' },

        { keyId: '5147f1a6-2fe7-402a-9c14-05cfeb82fdbe', keyType: 'VIDEO' },
        { keyId: '5147f1a6-2fe7-402a-9c14-05cfeb82fdbe', keyType: 'AUDIO' },

        { keyId: '9efaa339-6008-42a3-9d29-3fe0e0cdeb8e', keyType: 'VIDEO' },
        { keyId: '9efaa339-6008-42a3-9d29-3fe0e0cdeb8e', keyType: 'AUDIO' },
      ];

      // Act
      const cpixRequest = createDecryptionCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(
        multipleKeysRequest,
      );
    });
  });

  describe('createHlsCpixRequest', () => {
    const contentId = uuid();
    const singleKeyRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8"?>
      <cpix:CPIX xmlns:cpix="urn:dashif:org:cpix" xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc" contentId="${contentId}" version="2.3">
        <cpix:ContentKeyList>
          <cpix:ContentKey kid="15284606-72a2-0dcc-fecb-2988cfb8738f" commonEncryptionScheme="cbcs" />
        </cpix:ContentKeyList>
        <cpix:DRMSystemList>
          <cpix:DRMSystem kid="15284606-72a2-0dcc-fecb-2988cfb8738f" systemId="94ce86fb-07ff-4f43-adb8-93d2fa968ca2">
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
        </cpix:DRMSystemList>
        <cpix:ContentKeyUsageRuleList>
          <cpix:ContentKeyUsageRule kid="15284606-72a2-0dcc-fecb-2988cfb8738f">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="15284606-72a2-0dcc-fecb-2988cfb8738f">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
        </cpix:ContentKeyUsageRuleList>
      </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });

    const multipleKeysRequest = create(
      { version: '1.0', encoding: 'UTF-8' },
      `<?xml version="1.0" encoding="UTF-8"?>
      <cpix:CPIX xmlns:cpix="urn:dashif:org:cpix" xmlns:pskc="urn:ietf:params:xml:ns:keyprov:pskc" contentId="${contentId}" version="2.3">
        <cpix:ContentKeyList>
          <cpix:ContentKey kid="15284606-72a2-0dcc-fecb-2988cfb8738f" commonEncryptionScheme="cbcs" />
          <cpix:ContentKey kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" commonEncryptionScheme="cbcs" />
        </cpix:ContentKeyList>
        <cpix:DRMSystemList>
          <cpix:DRMSystem kid="15284606-72a2-0dcc-fecb-2988cfb8738f" systemId="94ce86fb-07ff-4f43-adb8-93d2fa968ca2">
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
          <cpix:DRMSystem kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe" systemId="94ce86fb-07ff-4f43-adb8-93d2fa968ca2">
            <cpix:HLSSignalingData playlist="media" />
            <cpix:HLSSignalingData playlist="master" />
          </cpix:DRMSystem>
        </cpix:DRMSystemList>
        <cpix:ContentKeyUsageRuleList>
          <cpix:ContentKeyUsageRule kid="15284606-72a2-0dcc-fecb-2988cfb8738f">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="15284606-72a2-0dcc-fecb-2988cfb8738f">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe">
            <cpix:VideoFilter/>
          </cpix:ContentKeyUsageRule>
          <cpix:ContentKeyUsageRule kid="5147f1a6-2fe7-402a-9c14-05cfeb82fdbe">
            <cpix:AudioFilter/>
          </cpix:ContentKeyUsageRule>
        </cpix:ContentKeyUsageRuleList>
      </cpix:CPIX>`,
    ).end({
      prettyPrint: true,
      spaceBeforeSlash: true,
    });
    it('request is generated, if drm keys list has one key', () => {
      // Arrange
      const drmKeys: string[] = ['15284606-72a2-0dcc-fecb-2988cfb8738f'];

      // Act
      const cpixRequest = createHlsCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(singleKeyRequest);
    });

    it('request is generated, if drm keys list has multiple keys', () => {
      // Arrange
      const drmKeys: string[] = [
        '15284606-72a2-0dcc-fecb-2988cfb8738f',
        '5147f1a6-2fe7-402a-9c14-05cfeb82fdbe',
      ];

      // Act
      const cpixRequest = createHlsCpixRequest(contentId, drmKeys);

      // Assert
      expect(cpixRequest).not.toBeUndefined();
      expect(convertObjectToXml(cpixRequest!)).toStrictEqual(
        multipleKeysRequest,
      );
    });
  });
});
