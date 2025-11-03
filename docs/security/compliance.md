---
sidebar_position: 2
---

# Compliance

Operating a payment gateway requires adherence to various regulatory and industry standards. This document outlines the compliance requirements for using BirrLink and how we support your compliance obligations.

## Regulatory Framework

### Ethiopian Financial Regulations
BirrLink operates under the regulatory framework established by the National Bank of Ethiopia (NBE) and complies with all applicable local financial regulations:

- **Payment Systems Proclamation No. 1161/2019**: Governs payment systems and services
- **Commercial Banking and Financial Institutions Proclamation No. 1248/2021**: Regulates financial institutions
- **Anti-Money Laundering and Counter-Terrorism Financing Proclamation No. 643/2009**: Requires AML/CFT compliance measures

### International Standards
In addition to local regulations, BirrLink adheres to international standards:
- **PCI DSS Level 1**: Payment Card Industry Data Security Standard
- **ISO 27001**: Information Security Management
- **GDPR**: For processing EU citizen data

## Data Privacy & Protection

### Data Collection Principles
BirrLink follows these data privacy principles:
- **Consent**: Only collect data with explicit consent
- **Purpose Limitation**: Use data only for specified purposes
- **Data Minimization**: Collect only necessary data
- **Storage Limitation**: Retain data only as long as needed
- **Integrity & Confidentiality**: Protect data with appropriate security measures

### Customer Rights
Customers have the right to:
- Access their personal data
- Rectify inaccurate data
- Request deletion of their data
- Data portability
- Object to processing
- Complain to regulatory authorities

### Data Residency
All customer data is stored within Ethiopia to comply with data residency requirements.

## Anti-Money Laundering (AML)

### Customer Due Diligence (CDD)
BirrLink implements comprehensive CDD procedures:
- Identity verification for all merchants
- Risk assessment for each customer
- Ongoing transaction monitoring
- Enhanced due diligence for high-risk customers

### Transaction Monitoring
- Real-time monitoring of transactions for suspicious activity
- Automated alerts for unusual transaction patterns
- Manual review of flagged transactions
- Reporting to relevant authorities when required

### Record Keeping
- Maintain transaction records for 5 years as required by NBE
- Keep customer identification records
- Document all AML-related activities
- Provide audit trails for regulatory examination

## PCI DSS Compliance

### PCI DSS Requirements
BirrLink maintains PCI DSS Level 1 compliance, which includes:

1. **Build and Maintain a Secure Network**
   - Install and maintain a firewall configuration
   - Do not use vendor-supplied defaults for system passwords

2. **Protect Cardholder Data**
   - Protect stored cardholder data
   - Encrypt transmission of cardholder data across open networks

3. **Maintain a Vulnerability Management Program**
   - Use and regularly update anti-virus software
   - Develop and maintain secure systems and applications

4. **Implement Strong Access Control Measures**
   - Restrict access to cardholder data by business need-to-know
   - Assign a unique ID to each person with computer access
   - Restrict physical access to cardholder data

5. **Regularly Monitor and Test Networks**
   - Track and monitor all access to network resources and cardholder data
   - Regularly test security systems and processes

6. **Maintain an Information Security Policy**
   - Maintain a policy that addresses information security for all personnel

### SAQ Compliance for Merchants
When integrating with BirrLink, you may need to complete a PCI DSS Self-Assessment Questionnaire (SAQ):
- **SAQ A**: For merchants who only accept card data via third-party services
- **SAQ A-EP**: For e-commerce where payment pages are hosted by third parties
- **SAQ B**: For merchants who process card-present transactions with standalone terminals
- **SAQ C**: For merchants with payment application systems connected to the Internet
- **SAQ P2PE-HW**: For merchants who use only payment terminals with validated P2PE

## Reporting Requirements

### Regulatory Reporting
BirrLink handles required reporting to NBE including:
- Transaction volume and value reports
- Suspicious transaction reports (STRs)
- Annual compliance reports
- Incident notifications

### Your Reporting Obligations
As a merchant, you may have additional reporting requirements:
- Transaction reporting for tax purposes
- AML/CFT reporting if threshold is exceeded
- Annual financial reporting

## Compliance Resources

### Documentation
BirrLink provides compliance documentation including:
- PCI DSS Attestation of Compliance (AOC)
- Network security scan reports from Approved Scanning Vendor (ASV)
- Compliance certificates and audit reports

### Compliance Support
- Dedicated compliance team for questions
- Regular compliance updates and alerts
- Compliance training resources
- Best practice guides

## Risk Management

### Transaction Limits
To manage risk, BirrLink implements:
- Per-transaction limits
- Daily and monthly volume limits
- Merchant-specific limits based on risk profile
- Enhanced approval processes for high-value transactions

### Fraud Prevention
- Real-time fraud detection algorithms
- Machine learning-based risk assessment
- Manual review processes for high-risk transactions
- Collaboration with financial institutions for fraud intelligence

## Audit & Monitoring

### Internal Audits
BirrLink conducts regular internal audits to ensure compliance with:
- Regulatory requirements
- Industry standards
- Internal policies and procedures
- Customer agreements

### External Assessments
- Annual PCI DSS assessments by QSA
- Regular security penetration testing
- Compliance verification by independent assessors
- Regulatory examinations

## Compliance Certification

### How to Verify Compliance
You can verify BirrLink's compliance status:
- Check our compliance certificates
- Review our Attestation of Compliance (AOC)
- Verify with NBE that we are licensed
- Review our security audit reports

### Maintaining Your Own Compliance
To maintain your compliance when using BirrLink:
- Follow PCI DSS requirements appropriate to your role
- Complete required SAQ annually
- Implement secure integration practices
- Monitor and report compliance violations

## Incident Response

### Security Incidents
In case of a security incident:
1. Contact BirrLink security team immediately
2. Preserve evidence as required by law
3. Notify affected customers as required
4. Report to regulatory authorities if necessary

### Data Breach Procedures
In case of a data breach:
1. Immediate containment and assessment
2. Customer notification within required timeframes
3. Regulatory reporting to NBE
4. Investigation and remediation

## Ongoing Compliance

### Compliance Updates
Regulations and standards evolve, so we provide:
- Regular compliance updates
- Impact assessments for regulatory changes
- Implementation guidance for new requirements
- Timeline for compliance deadlines

### Training & Awareness
- Regular compliance training for staff
- Security awareness programs
- Updates on regulatory changes
- Best practice sharing

For specific compliance questions or to request compliance documentation, contact our compliance team at compliance@birrlink.et.