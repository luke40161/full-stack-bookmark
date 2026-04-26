import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, List, Modal, Space, Typography, message, Popconfirm } from 'antd'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const { Title, Paragraph, Link, Text } = Typography

function App() {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    let isMounted = true

    axios
      .get(`${API_BASE}/bookmarks`)
      .then((response) => {
        if (isMounted) {
          setBookmarks(response.data)
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to load bookmarks')
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const onFinish = async (values) => {
    setSubmitting(true)
    try {
      const response = await axios.post(`${API_BASE}/bookmarks`, values)
      setBookmarks((current) => [response.data, ...current])
      form.resetFields()
      message.success('Bookmark added successfully')
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add bookmark')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (bookmark) => {
    setEditingId(bookmark._id)
    editForm.setFieldsValue({
      title: bookmark.title,
      link: bookmark.link,
      description: bookmark.description,
    })
    setIsModalVisible(true)
  }

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      setSubmitting(true)
      const response = await axios.put(`${API_BASE}/bookmarks/${editingId}`, values)
      setBookmarks((current) =>
        current.map((item) => (item._id === editingId ? response.data : item)),
      )
      setIsModalVisible(false)
      setEditingId(null)
      editForm.resetFields()
      message.success('Bookmark updated successfully')
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await axios.delete(`${API_BASE}/bookmarks/${id}`)
      setBookmarks((current) => current.filter((item) => item._id !== id))
      message.success('Bookmark deleted successfully')
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete bookmark')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="page">
      <Card className="container">
        <Title level={2}>Bookmark Manager</Title>
        <Paragraph type="secondary">
          Save links with a title and short description.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="bookmark-form"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Example: React docs" />
          </Form.Item>

          <Form.Item
            label="Link"
            name="link"
            rules={[
              { required: true, message: 'Please enter a link' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input placeholder="https://react.dev" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Short notes about why this link matters"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Add Bookmark
          </Button>
        </Form>

        <List
          className="bookmark-list"
          loading={loading}
          dataSource={bookmarks}
          locale={{ emptyText: 'No bookmarks yet' }}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                title={
                  <Link href={item.link} target="_blank">
                    {item.title}
                  </Link>
                }
                description={
                  item.description ? item.description : <Text type="secondary">No description</Text>
                }
              />
              <Space>
                <Button type="primary" size="small" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete bookmark"
                  description="Are you sure you want to delete this bookmark?"
                  onConfirm={() => handleDelete(item._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small" loading={deleting === item._id}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </List.Item>
          )}
        />

        <Modal
          title="Edit Bookmark"
          open={isModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => {
            setIsModalVisible(false)
            setEditingId(null)
            editForm.resetFields()
          }}
          confirmLoading={submitting}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Link"
              name="link"
              rules={[
                { required: true, message: 'Please enter a link' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </main>
  )
}

export default App
