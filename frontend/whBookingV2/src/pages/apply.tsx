import { Alert, Button, Checkbox, Container, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apply, ApplyValues } from "../services/expeditions";

const phoneCodes = [
  { value: "+47", label: "Norway (+47)" },
  { value: "+46", label: "Sweden (+46)" },
  { value: "+45", label: "Denmark (+45)" },
  { value: "+358", label: "Finland (+358)" },
  { value: "+354", label: "Iceland (+354)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+353", label: "Ireland (+353)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+32", label: "Belgium (+32)" },
  { value: "+33", label: "France (+33)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+351", label: "Portugal (+351)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+41", label: "Switzerland (+41)" },
  { value: "+43", label: "Austria (+43)" },
  { value: "+48", label: "Poland (+48)" },
  { value: "+30", label: "Greece (+30)" },
  { value: "+1", label: "USA / Canada (+1)" },
  { value: "+52", label: "Mexico (+52)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+54", label: "Argentina (+54)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+64", label: "New Zealand (+64)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+86", label: "China (+86)" },
  { value: "+91", label: "India (+91)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
];

function Apply() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

    const form = useForm<ApplyValues>({
        mode: 'uncontrolled',
        initialValues: {
          name: '',
          email: '',
          phoneCode: '+47',
          phone: '',
          student: false,
        },
        validate: {
          name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          phoneCode: (value) => (value ? null : 'Select a country code'),
          phone: (value) => (/^\d{4,14}$/.test(value) ? null : 'Phone number must be 4-14 digits'),
        },
      });

      const handleSubmit = async (values: typeof form.values) => {
        if (!id) return
        setLoading(true)
        setStatus("idle")
        try {
          await apply(id, values)
          setStatus("success")
          form.reset()
        } catch (error) {
          console.error('Error sending application:', error)
          setStatus("error")
        } finally {
          setLoading(false)
        }
      };
    
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1}>Apply for this trip</Title>
        <Text>
          We’re thrilled that you’re considering joining one of our expeditions! Prepare yourself for an experience of a lifetime as we explore the most captivating and uncharted oceans together.
          For each expedition, we have exciting projects that you can learn more about on our website. Please fill in your contact information below, and our Expedition Leader/Skipper will reach out to you for more details and to discuss any questions you may have.
        </Text>
        <Text>We look forward to collaborating with you on board!</Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Title order={2}>Contact Details</Title>
            <TextInput
              label="Full name"
              placeholder="Your name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              {...form.getInputProps('email')}
            />
            <Group align="flex-start" wrap="nowrap" gap="sm">
              <Select
                label="Area code"
                data={phoneCodes}
                searchable
                allowDeselect={false}
                w={150}
                {...form.getInputProps('phoneCode')}
              />
              <TextInput
                label="Phone"
                placeholder="Your phone number"
                inputMode="numeric"
                style={{ flex: 1 }}
                {...form.getInputProps('phone')}
              />
            </Group>
            <Checkbox
              label="I am a student and would like to apply for a scholarship for this trip."
              {...form.getInputProps('student', { type: 'checkbox' })}
              color="#F57E20"
            />
            {status === "success" && (
              <Alert color="green">Your application has been sent. We will be in touch soon!</Alert>
            )}
            {status === "error" && (
              <Alert color="red">Something went wrong. Please try again later.</Alert>
            )}
            <Button type="submit" mt="md" color="#F57E20" loading={loading}>Submit</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}

export default Apply