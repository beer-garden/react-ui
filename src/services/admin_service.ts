import axios from 'axios'

class AdminService {
  rescan() {
    axios.patch('/api/v1/admin/', { operation: 'rescan' })
  }
}

const item = new AdminService()

export default item
