import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, List, Modal, Space, Typography, message, Popconfirm, Tabs } from 'antd'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const { Title, Paragraph, Link, Text } = Typography

function App() {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [collectionForm] = Form.useForm()
  const [editCollectionForm] = Form.useForm()
  
  const [bookmarks, setBookmarks] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCollectionId, setEditingCollectionId] = useState(null)
  const [isCollectionModalVisible, setIsCollectionModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(null)

  // Load bookmarks
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

  // Load collections
  useEffect(() => {
    let isMounted = true

    axios
      .get(`${API_BASE}/collections`)
      .then((response) => {
        if (isMounted) {
          setCollections(response.data)
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to load collections')
      })
      .finally(() => {
        if (isMounted) {
          setCollectionLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Bookmark handlers
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

  // Collection handlers
  const onCollectionFinish = async (values) => {
    setSubmitting(true)
    try {
      const response = await axios.post(`${API_BASE}/collections`, values)
      setCollections((current) => [response.data, ...current])
      collectionForm.resetFields()
      message.success('Collection created successfully')
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create collection')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCollection = (collection) => {
    setEditingCollectionId(collection._id)
    editCollectionForm.setFieldsValue({
      name: collection.name,
      description: collection.description,
    })
    setIsCollectionModalVisible(true)
  }

  const handleEditCollectionSubmit = async () => {
    try {
      const values = await editCollectionForm.validateFields()
      setSubmitting(true)
      const response = await axios.put(`${API_BASE}/collections/${editingCollectionId}`, values)
      setCollections((current) =>
        current.map((item) => (item._id === editingCollectionId ? response.data : item)),
      )
      setIsCollectionModalVisible(false)
      setEditingCollectionId(null)
      editCollectionForm.resetFields()
      message.success('Collection updated successfully')
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCollection = async (id) => {
    setDeleting(id)
    try {
      await axios.delete(`${API_BASE}/collections/${id}`)
      setCollections((current) => current.filter((item) => item._id !== id))
      message.success('Collection deleted successfully')
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete collection')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="page">
      <Card className="container">
        <Title level={2}>Bookmark & Collection Manager</Title>
        <Paragraph type="secondary">
          Manage your bookmarks and organize them into collections.
        </Paragraph>

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Bookmarks',
              children: (
                <>
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
                </>
              ),
            },
            {
              key: '2',
              label: 'Collections',
              children: (
                <>
                  <Form
                    form={collectionForm}
                    layout="vertical"
                    onFinish={onCollectionFinish}
                    autoComplete="off"
                    className="collection-form"
                  >
                    <Form.Item
                      label="Collection Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter a collection name' }]}
                    >
                      <Input placeholder="Example: Work Resources" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                      <Input.TextArea
                        rows={3}
                        placeholder="Describe this collection (BUG: No validation on length)"
                      />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={submitting}>
                      Create Collection
                    </Button>
                  </Form>

                  <List
                    className="collection-list"
                    loading={collectionLoading}
                    dataSource={collections}
                    locale={{ emptyText: 'No collections yet' }}
                    renderItem={(item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          title={item.name}
                          description={
                            item.description ? item.description : <Text type="secondary">No description</Text>
                          }
                        />
                        <Space>
                          <Text>Bookmarks: {item.bookmarkCount}</Text>
                          <Button type="primary" size="small" onClick={() => handleEditCollection(item)}>
                            Edit
                          </Button>
                          <Popconfirm
                            title="Delete collection"
                            description="Are you sure you want to delete this collection?"
                            onConfirm={() => handleDeleteCollection(item._id)}
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
                    title="Edit Collection"
                    open={isCollectionModalVisible}
                    onOk={handleEditCollectionSubmit}
                    onCancel={() => {
                      setIsCollectionModalVisible(false)
                      setEditingCollectionId(null)
                      editCollectionForm.resetFields()
                    }}
                    confirmLoading={submitting}
                  >
                    <Form form={editCollectionForm} layout="vertical">
                      <Form.Item
                        label="Collection Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter a collection name' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} placeholder="(BUG: No validation on length)" />
                      </Form.Item>
                    </Form>
                  </Modal>
                </>
              ),
            },
          ]}
        />
      </Card>
    </main>
  )
}

export default App
