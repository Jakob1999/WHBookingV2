import { Alert, Button, Checkbox, Container, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apply } from "../services/expeditions";

function Apply() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          name: '',
          email: '',
          phone: '',
          student: false,
          organizer: false,
        },
        validate: {
          name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          phone: (value) => (/^\d{8}$/.test(value) ? null : 'Phone number must be 8 digits'),
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
            <TextInput
              label="Phone"
              placeholder="Your phone number"
              {...form.getInputProps('phone')}
            />
            <Checkbox
              label="I am a student and would like to apply for a scholarship for this trip."
              {...form.getInputProps('student', { type: 'checkbox' })}
              color="#F57E20"
            />
            <Checkbox
              label="I want to organize an expedition, please contact me."
              {...form.getInputProps('organizer', { type: 'checkbox' })}
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