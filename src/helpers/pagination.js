

export default class Pagination {

    constructor ({currentPage, totalItems, itemsPerPage}) {
        this.validCurrentPage = false // change to true at _setCurrentPage() if is ok
        this.currentPage = this._setCurrentPage(currentPage)
        this.totalItems = Number.parseInt(totalItems)
        this.itemsPerPage = Number.parseInt(itemsPerPage) || 10 // default 10 items per page
        this.totalPages = this._setTotalPages(totalItems, this.itemsPerPage)
        this.previousPage = this.getPreviousPage()
        this.nextPage = this.getNextPage()
        this.lastPage = this.getLastPage()
        this.skip = this.getSkip()
    }

    _setCurrentPage (currentPage) {
        if (currentPage < 1 || isNaN(parseInt(currentPage))) {
            return 1 
        } else if (currentPage > this.totalPages) {
            return Number.parseInt(this.totalPages)
        } else {
            this.validCurrentPage = true
            return Number.parseInt(currentPage)
        }
    }

    _setTotalPages (totalItems, itemsPerPage) {
        return Math.ceil(Number.parseInt(totalItems) / Number.parseInt(itemsPerPage))
    }

    getPreviousPage () {
        if (this.currentPage <= 1) {
            return false
        }
        return (this.currentPage - 1)
    }

    getNextPage () {
        if (this.currentPage >= this.totalPages) {
            return false
        }
        return (this.currentPage + 1)
    }

    getLastPage () {
        return this.totalPages
    }

    getCurrentPage () {
        return this.currentPage
    }

    getSkip () {
        return this.itemsPerPage * (this.currentPage - 1)
    }

    getTotalPages () {
        return this.totalPages
    }

    checkIfValidCurrentPage () {
        return this.validCurrentPage
    }
}
