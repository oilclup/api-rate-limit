export const paginatedResults = async (rows, count, limit, req) => {
    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(req.query.page) || 1,
      perPage: limit,
      data: rows,
    }
  }
  