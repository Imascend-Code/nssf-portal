import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  Link as MUILink,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function Support() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
          <SupportAgentIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" fontWeight={800}>
            Support
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            Find answers to common questions or reach out to our support team.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* FAQ */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined">
              <CardHeader title="Frequently Asked Questions" />
              <CardContent>
                <FaqItem q="How do I reset my password?">
                  Go to the sign-in page and choose <strong>Forgot password</strong>. You’ll receive an email
                  with a secure link to reset it.
                </FaqItem>
                <FaqItem q="Where can I see my payment history?">
                  Navigate to <strong>Payments</strong> to see status, history and download statements.
                </FaqItem>
                <FaqItem q="How do I update my beneficiaries?">
                  Open <strong>Profile & Beneficiaries</strong>, edit the relevant section and save changes.
                </FaqItem>
                <FaqItem q="Is my data secure?">
                  Yes. We use strong encryption, access controls, and privacy-by-design practices.
                </FaqItem>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardHeader title="Contact us" />
              <CardContent>
                <Stack spacing={2}>
                  <TextField label="Your email" type="email" fullWidth />
                  <TextField label="Subject" fullWidth />
                  <TextField label="Message" fullWidth multiline minRows={4} />
                  <Button variant="contained" startIcon={<MarkEmailReadIcon />}>
                    Send message
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    For sensitive account changes, we may verify your identity for your protection.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Security note */}
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <ShieldOutlinedIcon color="primary" />
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Beware of phishing. We will never ask for your password by email. Always check the website domain and
                contact us via the official channels listed here. Learn more at{" "}
                <MUILink href="#" underline="hover">
                  Security best practices
                </MUILink>.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">{q}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
