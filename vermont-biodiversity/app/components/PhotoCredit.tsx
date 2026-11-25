type PhotoCreditProps = {
  title: string;
  author: string;
  license: string;
  imageUrl?: string;
  licenseUrl?: string;
};

export default function PhotoCredit({
  title,
  author,
  license,
  imageUrl,
  licenseUrl,
}: PhotoCreditProps) {
  return (
    <p className="photo-credit">
      {imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          &quot;{title}&quot;
        </a>
      ) : (
        <span>&quot;{title}&quot;</span>
      )}
      {" by "}{author}{" "}
      {license === "Public Domain Mark 1.0"
        ? "is marked with "
        : "is licensed under "}
      {licenseUrl ? (
        <a
          href={licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {license}
        </a>
      ) : (
        license
      )}
      .
    </p>
  );
}