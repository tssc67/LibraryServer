BEGIN TRANSACTION;
UPDATE books
  SET left = left -1
  WHERE id = ?1
  AND left > 0;
INSERT INTO borrowList VALUES(
  ?1,?2,date('now')
)
COMMIT;
-- [id to borrow,borrower name]
