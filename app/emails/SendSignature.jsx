import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Text, } from '@react-email/components';
import * as React from 'react';
  
export const SendConsentEmail = ({pid, authID}) => (
    <Html>
        <Head />
        <Preview>Patient Consent Document for Research</Preview>
        <Body style={main}>
        <Container style={container}>
            <Img
            src="https://i.ibb.co/r4NrYsj/signature.gif"
            width="60"
            height="60"
            alt="Your Logo"
            style={logo}
            />
            <Heading style={heading}>Thank You for Participating in Research!</Heading>

            <Text style={paragraph}>
            We would like to express our gratitude for your willingness to participate in our research study. Your contribution is invaluable.
            </Text>
            <Button pY={11} pX={23} style={button} href="">
            View and Sign Consent Document {authID}--{pid}
            </Button>
            <Text style={note}>
            Note: Our website provides a convenient feature to summarize the consent document for your ease of understanding. You can access this summary along with the full document on our website.
            </Text>
            <Hr style={hr} />
            <Link href="" style={reportLink}>
            Best regards,
            <br />
            MedStudySign.ai
            </Link>
        </Container>
        </Body>
    </Html>
);
  
export default SendConsentEmail;
  
  const logo = {
    width: 60,
    height: 60,
  };
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '560px',
  };
  
  const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
  };
  
  const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
  };
  
  const button = {
    backgroundColor: '#37caca',
    borderRadius: '5px',
    fontWeight: '600',
    color: '#fff',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    cursor: 'pointer',
  };
  
  const note = {
    fontSize: '15px',
    fontStyle: 'italic',
    color: '#666',
    marginTop: '11px',
  };
  
  const reportLink = {
    fontSize: '14px',
    color: '#b4becc',
  };
  
  const hr = {
    borderColor: '#dfe1e4',
    margin: '32px 0 20px',
  };
  