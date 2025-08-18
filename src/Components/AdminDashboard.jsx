"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Phone, Mail, MapPin, Linkedin, Youtube, Instagram, ArrowLeft, X, Plus, Edit, Trash2, Users, BookOpen, Calendar, Settings } from "lucide-react"
import Navbar from "./navbar"
import { useAuth } from "../context/AuthContext.jsx"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAddWorkshop, setShowAddWorkshop] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user"
  })

  const [courseForm, setCourseForm] = useState({
    title: "",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "",
    price: "",
    image: "/images/circuit-board.png",
    about: "",
    syllabus: [""],
    whoShouldAttend: [""],
    prerequisites: [""]
  })

  const [workshopForm, setWorkshopForm] = useState({
    title: "",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "",
    price: "",
    image: "/images/circuit-board.png",
    about: "",
    syllabus: [""],
    whoShouldAttend: [""],
    prerequisites: [""]
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load users
      const usersResponse = await fetch('/api/admin/users', {
        credentials: 'include'
      })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Load courses
      const coursesResponse = await fetch('/api/admin/courses', {
        credentials: 'include'
      })
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses || [])
      }

      // Load workshops
      const workshopsResponse = await fetch('/api/admin/workshops', {
        credentials: 'include'
      })
      if (workshopsResponse.ok) {
        const workshopsData = await workshopsResponse.json()
        setWorkshops(workshopsData.workshops || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userForm)
      })
      if (response.ok) {
        setShowAddUser(false)
        setUserForm({ name: "", email: "", phone: "", role: "user" })
        loadData()
      }
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleAddCourse = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(courseForm)
      })
      if (response.ok) {
        setShowAddCourse(false)
        setCourseForm({
          title: "",
          instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
          duration: "",
          price: "",
          image: "/images/circuit-board.png",
          about: "",
          syllabus: [""],
          whoShouldAttend: [""],
          prerequisites: [""]
        })
        loadData()
      }
    } catch (error) {
      console.error('Error adding course:', error)
    }
  }

  const handleAddWorkshop = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(workshopForm)
      })
      if (response.ok) {
        setShowAddWorkshop(false)
        setWorkshopForm({
          title: "",
          instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
          duration: "",
          price: "",
          image: "/images/circuit-board.png",
          about: "",
          syllabus: [""],
          whoShouldAttend: [""],
          prerequisites: [""]
        })
        loadData()
      }
    } catch (error) {
      console.error('Error adding workshop:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/user/${userId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`/api/admin/course/${courseId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  const handleDeleteWorkshop = async (workshopId) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        const response = await fetch(`/api/admin/workshop/${workshopId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error('Error deleting workshop:', error)
      }
    }
  }

  const addSyllabusItem = (type) => {
    if (type === 'course') {
      setCourseForm(prev => ({
        ...prev,
        syllabus: [...prev.syllabus, ""]
      }))
    } else {
      setWorkshopForm(prev => ({
        ...prev,
        syllabus: [...prev.syllabus, ""]
      }))
    }
  }

  const addWhoShouldAttend = (type) => {
    if (type === 'course') {
      setCourseForm(prev => ({
        ...prev,
        whoShouldAttend: [...prev.whoShouldAttend, ""]
      }))
    } else {
      setWorkshopForm(prev => ({
        ...prev,
        whoShouldAttend: [...prev.whoShouldAttend, ""]
      }))
    }
  }

  const addPrerequisites = (type) => {
    if (type === 'course') {
      setCourseForm(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, ""]
      }))
    } else {
      setWorkshopForm(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, ""]
      }))
    }
  }

  const updateArrayField = (type, field, index, value) => {
    if (type === 'course') {
      setCourseForm(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }))
    } else {
      setWorkshopForm(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }))
    }
  }

  const removeArrayItem = (type, field, index) => {
    if (type === 'course') {
      setCourseForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    } else {
      setWorkshopForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/images/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#FFFFF0" }}>
            Admin Dashboard
          </h1>
          <p className="text-xl" style={{ color: "#B88AFF" }}>
            Manage Users, Courses, and Workshops
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "text-white" 
                : "text-black"
            }`}
            style={{ 
              backgroundColor: activeTab === "dashboard" ? "#000000" : "#B88AFF" 
            }}
          >
            <Users className="w-5 h-5 mr-2" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "users" 
                ? "text-white" 
                : "text-black"
            }`}
            style={{ 
              backgroundColor: activeTab === "users" ? "#000000" : "#B88AFF" 
            }}
          >
            <Users className="w-5 h-5 mr-2" />
            Users ({users.length})
          </Button>
          <Button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "courses" 
                ? "text-white" 
                : "text-black"
            }`}
            style={{ 
              backgroundColor: activeTab === "courses" ? "#000000" : "#B88AFF" 
            }}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Courses ({courses.length})
          </Button>
          <Button
            onClick={() => setActiveTab("workshops")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "workshops" 
                ? "text-white" 
                : "text-black"
            }`}
            style={{ 
              backgroundColor: activeTab === "workshops" ? "#000000" : "#B88AFF" 
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Workshops ({workshops.length})
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "#B88AFF" }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#FFFFF0" }}>{users.length}</h3>
              <p style={{ color: "#B88AFF" }}>Total Users</p>
            </Card>
            <Card className="text-center p-6" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
              <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#B88AFF" }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#FFFFF0" }}>{courses.length}</h3>
              <p style={{ color: "#B88AFF" }}>Total Courses</p>
            </Card>
            <Card className="text-center p-6" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
              <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "#B88AFF" }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#FFFFF0" }}>{workshops.length}</h3>
              <p style={{ color: "#B88AFF" }}>Total Workshops</p>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>Manage Users</h2>
              <Button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2"
                style={{ backgroundColor: "#B88AFF", color: "#000000" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user._id} className="p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: "#FFFFF0" }}>{user.name}</h3>
                      <p style={{ color: "#B88AFF" }}>{user.email}</p>
                      <p style={{ color: "#B88AFF" }}>Role: {user.role}</p>
                    </div>
                    <Button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1"
                      style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>Manage Courses</h2>
              <Button
                onClick={() => setShowAddCourse(true)}
                className="px-4 py-2"
                style={{ backgroundColor: "#B88AFF", color: "#000000" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="overflow-hidden" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
                  <img
                    src={course.image || "/images/circuit-board.png"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFF0" }}>{course.title}</h3>
                    <p className="text-sm mb-2" style={{ color: "#B88AFF" }}>{course.instructor}</p>
                    <p className="text-sm mb-2" style={{ color: "#B88AFF" }}>{course.duration}</p>
                    <p className="text-xl font-bold mb-4" style={{ color: "#B88AFF" }}>{course.price}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingItem({ type: 'course', data: course })}
                        className="flex-1 px-3 py-1"
                        style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="px-3 py-1"
                        style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Workshops Tab */}
        {activeTab === "workshops" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold" style={{ color: "#FFFFF0" }}>Manage Workshops</h2>
              <Button
                onClick={() => setShowAddWorkshop(true)}
                className="px-4 py-2"
                style={{ backgroundColor: "#B88AFF", color: "#000000" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Workshop
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <Card key={workshop._id} className="overflow-hidden" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
                  <img
                    src={workshop.image || "/images/circuit-board.png"}
                    alt={workshop.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFF0" }}>{workshop.title}</h3>
                    <p className="text-sm mb-2" style={{ color: "#B88AFF" }}>{workshop.instructor}</p>
                    <p className="text-sm mb-2" style={{ color: "#B88AFF" }}>{workshop.duration}</p>
                    <p className="text-xl font-bold mb-4" style={{ color: "#B88AFF" }}>{workshop.price}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingItem({ type: 'workshop', data: workshop })}
                        className="flex-1 px-3 py-1"
                        style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteWorkshop(workshop._id)}
                        className="px-3 py-1"
                        style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFF0" }}>Add New User</h2>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg" style={{ color: "#B88AFF" }}>Full Name</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    required
                    className="mt-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-lg" style={{ color: "#B88AFF" }}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    required
                    className="mt-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-lg" style={{ color: "#B88AFF" }}>Phone</Label>
                  <Input
                    id="phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    className="mt-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-lg" style={{ color: "#B88AFF" }}>Role</Label>
                  <select
                    id="role"
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="mt-2 w-full p-3 rounded-lg"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                  >
                    Add User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddUser(false)}
                    style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full border-2 border-purple-500 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFF0" }}>Add New Course</h2>
                <button
                  onClick={() => setShowAddCourse(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddCourse} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-lg" style={{ color: "#B88AFF" }}>Course Title</Label>
                    <Input
                      id="title"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-lg" style={{ color: "#B88AFF" }}>Price (₹)</Label>
                    <Input
                      id="price"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-lg" style={{ color: "#B88AFF" }}>Duration</Label>
                    <Input
                      id="duration"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-lg" style={{ color: "#B88AFF" }}>Image URL</Label>
                    <Input
                      id="image"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({...courseForm, image: e.target.value})}
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="about" className="text-lg" style={{ color: "#B88AFF" }}>About Course</Label>
                  <Textarea
                    id="about"
                    value={courseForm.about}
                    onChange={(e) => setCourseForm({...courseForm, about: e.target.value})}
                    required
                    rows={4}
                    className="mt-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Syllabus</Label>
                  <div className="space-y-2 mt-2">
                    {courseForm.syllabus.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('course', 'syllabus', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('course', 'syllabus', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addSyllabusItem('course')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Syllabus Item
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Who Should Attend</Label>
                  <div className="space-y-2 mt-2">
                    {courseForm.whoShouldAttend.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('course', 'whoShouldAttend', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('course', 'whoShouldAttend', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addWhoShouldAttend('course')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Target Audience
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Prerequisites</Label>
                  <div className="space-y-2 mt-2">
                    {courseForm.prerequisites.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('course', 'prerequisites', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('course', 'prerequisites', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addPrerequisites('course')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Prerequisite
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                  >
                    Add Course
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCourse(false)}
                    style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Workshop Modal */}
        {showAddWorkshop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full border-2 border-purple-500 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFF0" }}>Add New Workshop</h2>
                <button
                  onClick={() => setShowAddWorkshop(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddWorkshop} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workshop-title" className="text-lg" style={{ color: "#B88AFF" }}>Workshop Title</Label>
                    <Input
                      id="workshop-title"
                      value={workshopForm.title}
                      onChange={(e) => setWorkshopForm({...workshopForm, title: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workshop-price" className="text-lg" style={{ color: "#B88AFF" }}>Price (₹)</Label>
                    <Input
                      id="workshop-price"
                      value={workshopForm.price}
                      onChange={(e) => setWorkshopForm({...workshopForm, price: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workshop-duration" className="text-lg" style={{ color: "#B88AFF" }}>Duration</Label>
                    <Input
                      id="workshop-duration"
                      value={workshopForm.duration}
                      onChange={(e) => setWorkshopForm({...workshopForm, duration: e.target.value})}
                      required
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workshop-image" className="text-lg" style={{ color: "#B88AFF" }}>Image URL</Label>
                    <Input
                      id="workshop-image"
                      value={workshopForm.image}
                      onChange={(e) => setWorkshopForm({...workshopForm, image: e.target.value})}
                      className="mt-2"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workshop-about" className="text-lg" style={{ color: "#B88AFF" }}>About Workshop</Label>
                  <Textarea
                    id="workshop-about"
                    value={workshopForm.about}
                    onChange={(e) => setWorkshopForm({...workshopForm, about: e.target.value})}
                    required
                    rows={4}
                    className="mt-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                  />
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Syllabus</Label>
                  <div className="space-y-2 mt-2">
                    {workshopForm.syllabus.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('workshop', 'syllabus', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('workshop', 'syllabus', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addSyllabusItem('workshop')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Syllabus Item
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Who Should Attend</Label>
                  <div className="space-y-2 mt-2">
                    {workshopForm.whoShouldAttend.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('workshop', 'whoShouldAttend', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('workshop', 'whoShouldAttend', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addWhoShouldAttend('workshop')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Target Audience
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-lg" style={{ color: "#B88AFF" }}>Prerequisites</Label>
                  <div className="space-y-2 mt-2">
                    {workshopForm.prerequisites.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('workshop', 'prerequisites', index, e.target.value)}
                          className="flex-1"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF", color: "#FFFFF0" }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('workshop', 'prerequisites', index)}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addPrerequisites('workshop')}
                      className="w-full"
                      style={{ backgroundColor: "#B88AFF", color: "#000000" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Prerequisite
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
                  >
                    Add Workshop
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddWorkshop(false)}
                    style={{ borderColor: "#B88AFF", color: "#B88AFF" }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
