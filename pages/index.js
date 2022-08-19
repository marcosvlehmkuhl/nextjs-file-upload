const HomePage = () => {
  return (
    <>
      <label for="avatar">Choose a profile picture:</label>

      <form action="/api/file-upload" method="POST" enctype="multipart/form-data">
        <input type="file"
          id="avatar" name="avatar"
          accept="image/png, image/jpeg"
        />
        <input type="submit" />
      </form>
    </>
  )
}

export default HomePage