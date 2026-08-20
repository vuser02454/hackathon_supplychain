from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import UserModel
from backend.schemas import UserLoginRequest, UserResponse, UserProfileUpdate

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=UserResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        user = UserModel(
            email=req.email or "a.vance@supplychain.ai",
            name="Alexander Vance",
            phone="+1 (555) 382-9014",
            role="VP of Global Logistics"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+1 (555) 382-9014") or "+1 (555) 382-9014",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+1 (555) 382-9014") or "+1 (555) 382-9014",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )

@router.put("/profile", response_model=UserResponse)
def update_profile(req: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        user = UserModel(
            email=req.email or "a.vance@supplychain.ai",
            name=req.name or "Alexander Vance",
            phone=req.phone or "+1 (555) 382-9014",
            role=req.role or "VP of Global Logistics",
            avatar=req.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        )
        db.add(user)
    else:
        if req.name is not None:
            user.name = req.name
        if req.email is not None:
            user.email = req.email
        if req.phone is not None:
            user.phone = req.phone
        if req.role is not None:
            user.role = req.role
        if req.avatar is not None:
            user.avatar = req.avatar
    
    db.commit()
    db.refresh(user)
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+1 (555) 382-9014") or "+1 (555) 382-9014",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )
